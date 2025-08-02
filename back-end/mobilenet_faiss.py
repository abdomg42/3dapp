#!/usr/bin/env python3
import json
import sys
import numpy as np
import faiss
import pickle
import os
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input
from tensorflow.keras.preprocessing import image

# Redirect all TensorFlow output to stderr
import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'
import tensorflow as tf
tf.get_logger().setLevel('ERROR')

# Global model variable to avoid reloading
_model = None

def get_model():
    global _model
    if _model is None:
        # Suppress model download output
        with open(os.devnull, 'w') as fnull:
            import contextlib
            with contextlib.redirect_stdout(fnull):
                _model = MobileNetV2(weights='imagenet', include_top=False, pooling='avg')
    return _model

class MobileNetFAISS:
    def __init__(self):
        self.index_file = 'faiss_index.bin'
        self.metadata_file = 'faiss_metadata.pkl'
        self.dimension = 1280
        self.model = get_model()  # Use cached model
        self.load_index()
    
    def load_index(self):
        if os.path.exists(self.index_file):
            self.index = faiss.read_index(self.index_file)
            with open(self.metadata_file, 'rb') as f:
                self.metadata = pickle.load(f)
        else:
            self.index = faiss.IndexFlatIP(self.dimension)
            self.metadata = {}
    
    def save_index(self):
        faiss.write_index(self.index, self.index_file)
        with open(self.metadata_file, 'wb') as f:
            pickle.dump(self.metadata, f)
    
    def extract_mobilenet_features(self, image_path):
        try:
            img = image.load_img(image_path, target_size=(224, 224))
            img_array = image.img_to_array(img)
            img_array = np.expand_dims(img_array, axis=0)
            img_array = preprocess_input(img_array)
            
            # Suppress predict output
            with open(os.devnull, 'w') as fnull:
                import contextlib
                with contextlib.redirect_stdout(fnull):
                    features = self.model.predict(img_array, verbose=0)
            
            features = features.flatten()
            features = features / (np.linalg.norm(features) + 1e-8)
            
            return features.astype(np.float32)
        except Exception as e:
            print(f"Error extracting features: {e}", file=sys.stderr)
            return None
    
    def add_embedding(self, image_path, image_id):
        features = self.extract_mobilenet_features(image_path)
        if features is None:
            return False
        
        self.index.add(features.reshape(1, -1))
        self.metadata[self.index.ntotal - 1] = image_id
        self.save_index()
        return True
    
    def search_similar(self, query_image_path, top_k=15):
        query_features = self.extract_mobilenet_features(query_image_path)
        if query_features is None:
            return []
        
        similarities, indices = self.index.search(query_features.reshape(1, -1), top_k)
        
        results = []
        for sim, idx in zip(similarities[0], indices[0]):
            if idx >= 0 and idx in self.metadata:
                results.append({
                    'image_id': self.metadata[idx],
                    'similarity': float(sim)
                })
        
        return results

def main():
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument('--action', required=True, choices=['add', 'search'])
    parser.add_argument('--image', required=True)
    parser.add_argument('--image_id', type=int)
    parser.add_argument('--top_k', type=int, default=15)
    
    args = parser.parse_args()
    mobilenet_faiss = MobileNetFAISS()
    
    if args.action == 'add':
        success = mobilenet_faiss.add_embedding(args.image, args.image_id)
        print(json.dumps({'success': success}))
    elif args.action == 'search':
        results = mobilenet_faiss.search_similar(args.image, args.top_k)
        print(json.dumps({'success': True, 'results': results}))

if __name__ == '__main__':
    main() 