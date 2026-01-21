-- Create storage bucket for menu images
INSERT INTO storage.buckets (id, name, public)
VALUES ('menu-images', 'menu-images', true);

-- Allow authenticated users to upload to their own folder
CREATE POLICY "Users can upload to own folder"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'menu-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow authenticated users to update their own files
CREATE POLICY "Users can update own files"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'menu-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow authenticated users to delete their own files
CREATE POLICY "Users can delete own files"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'menu-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow anyone to view files (public bucket)
CREATE POLICY "Anyone can view menu images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'menu-images');