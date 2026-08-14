-- Migration: Create complete_payment_and_enroll function with security definer
CREATE OR REPLACE FUNCTION public.complete_payment_and_enroll(
    p_reference TEXT,
    p_user_id UUID,
    p_course_id TEXT,
    p_amount NUMERIC,
    p_secret_key TEXT
) RETURNS VOID AS $$
BEGIN
    -- Verify secret key to prevent unauthorized execution
    IF p_secret_key IS NULL OR p_secret_key <> 'sk_test_eed8b812438a58de3a0d043b3b0bd6b1be026c43' THEN
        RAISE EXCEPTION 'Unauthorized: Invalid secret key';
    END IF;

    -- 1. Insert or update payments record to success status
    INSERT INTO public.payments (user_id, course_id, amount, status, payment_method, transaction_id)
    VALUES (p_user_id, p_course_id, p_amount, 'success', 'paystack', p_reference)
    ON CONFLICT (transaction_id) 
    DO UPDATE SET status = 'success';

    -- 2. Insert enrollment record
    INSERT INTO public.enrollments (user_id, course_id, status)
    VALUES (p_user_id, p_course_id, 'In Progress')
    ON CONFLICT (user_id, course_id) DO NOTHING;

    -- 3. Insert progress record
    INSERT INTO public.progress (user_id, course_id, progress_percent, lessons_completed)
    VALUES (p_user_id, p_course_id, 0, '[]'::jsonb)
    ON CONFLICT (user_id, course_id) DO NOTHING;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
