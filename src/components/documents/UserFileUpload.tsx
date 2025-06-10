
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface UserFileUploadProps {
  onUploadComplete: () => void;
  className?: string;
}

export const UserFileUpload: React.FC<UserFileUploadProps> = ({
  onUploadComplete,
  className = ""
}) => {
  const { user } = useAuth();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    try {
      const fileName = `${user.id}/${Date.now()}_${file.name}`;
      
      const { error } = await supabase.storage
        .from('user-files')
        .upload(fileName, file);

      if (error) throw error;

      const { error: dbError } = await supabase
        .from('user_uploaded_files')
        .insert({
          user_id: user.id,
          filename: file.name,
          original_filename: file.name,
          file_path: fileName,
          file_size: file.size,
          file_type: file.type
        });

      if (dbError) throw dbError;

      toast.success('File uploaded successfully');
      onUploadComplete();
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload file');
    }
  };

  return (
    <div className={className}>
      <input
        type="file"
        onChange={handleFileUpload}
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
      />
    </div>
  );
};
