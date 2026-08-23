INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'snapcut',
  'snapcut',
  false,
  5242880,
  ARRAY['image/png', 'image/jpeg', 'image/jpg', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "snapcut_insert_own" ON storage.objects;
CREATE POLICY "snapcut_insert_own" ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'snapcut'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

DROP POLICY IF EXISTS "snapcut_update_own" ON storage.objects;
CREATE POLICY "snapcut_update_own" ON storage.objects FOR UPDATE TO authenticated
USING (
  bucket_id = 'snapcut'
  AND (storage.foldername(name))[1] = auth.uid()::text
)
WITH CHECK (
  bucket_id = 'snapcut'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

DROP POLICY IF EXISTS "images_insert_own" ON public.image_processing;
CREATE POLICY "images_insert_own" ON public.image_processing FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "images_update_own" ON public.image_processing;
CREATE POLICY "images_update_own" ON public.image_processing FOR UPDATE TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
