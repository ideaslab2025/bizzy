
-- Add a completion tracking column to user_document_progress table
ALTER TABLE user_document_progress 
ADD COLUMN IF NOT EXISTS is_completed BOOLEAN DEFAULT false;

-- Create an index for better performance when querying completion status
CREATE INDEX IF NOT EXISTS idx_user_document_progress_completion 
ON user_document_progress(user_id, is_completed);

-- Update existing completed_at entries to set is_completed = true
UPDATE user_document_progress 
SET is_completed = true 
WHERE completed_at IS NOT NULL AND is_completed = false;

-- Create a function to update progress when completion status changes
CREATE OR REPLACE FUNCTION update_document_completion(
  p_user_id UUID,
  p_document_id UUID,
  p_is_completed BOOLEAN
)
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO user_document_progress (
    user_id,
    document_id,
    is_completed,
    completed_at,
    viewed
  )
  VALUES (
    p_user_id,
    p_document_id,
    p_is_completed,
    CASE WHEN p_is_completed THEN now() ELSE NULL END,
    true
  )
  ON CONFLICT (user_id, document_id)
  DO UPDATE SET
    is_completed = p_is_completed,
    completed_at = CASE 
      WHEN p_is_completed AND user_document_progress.completed_at IS NULL THEN now()
      WHEN NOT p_is_completed THEN NULL
      ELSE user_document_progress.completed_at
    END,
    viewed = true;
END;
$$;
