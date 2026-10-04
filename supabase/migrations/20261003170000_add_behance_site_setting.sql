-- Adiciona o canal global "behance" ao Site Settings, preservando os demais.
INSERT INTO public.site_settings (key, value)
VALUES ('behance', NULL)
ON CONFLICT (key) DO NOTHING;
