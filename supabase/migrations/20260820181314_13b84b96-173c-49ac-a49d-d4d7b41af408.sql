CREATE POLICY "snapcut_read_own" ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'snapcut' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "snapcut_delete_own" ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'snapcut' AND (storage.foldername(name))[1] = auth.uid()::text);