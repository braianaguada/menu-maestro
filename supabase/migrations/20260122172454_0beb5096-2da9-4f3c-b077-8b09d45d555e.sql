-- Add scheduling columns to promotions
ALTER TABLE public.promotions
ADD COLUMN starts_at timestamp with time zone DEFAULT NULL,
ADD COLUMN ends_at timestamp with time zone DEFAULT NULL;

-- Create index for efficient time-based queries
CREATE INDEX idx_promotions_schedule ON public.promotions (starts_at, ends_at) WHERE starts_at IS NOT NULL OR ends_at IS NOT NULL;