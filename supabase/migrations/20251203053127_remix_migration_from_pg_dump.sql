CREATE EXTENSION IF NOT EXISTS "pg_graphql";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "plpgsql";
CREATE EXTENSION IF NOT EXISTS "supabase_vault";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
--
-- PostgreSQL database dump
--


-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.7

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--



SET default_table_access_method = heap;

--
-- Name: crop_data; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.crop_data (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    farmer_id text NOT NULL,
    crop text NOT NULL,
    event_date date NOT NULL,
    metric_name text NOT NULL,
    metric_value numeric NOT NULL,
    notes text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: crop_data crop_data_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.crop_data
    ADD CONSTRAINT crop_data_pkey PRIMARY KEY (id);


--
-- Name: idx_crop_data_event_date; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_crop_data_event_date ON public.crop_data USING btree (event_date);


--
-- Name: idx_crop_data_farmer_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_crop_data_farmer_id ON public.crop_data USING btree (farmer_id);


--
-- Name: idx_crop_data_metric_name; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_crop_data_metric_name ON public.crop_data USING btree (metric_name);


--
-- Name: crop_data Allow public insert access; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow public insert access" ON public.crop_data FOR INSERT TO authenticated, anon WITH CHECK (true);


--
-- Name: crop_data Allow public read access; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow public read access" ON public.crop_data FOR SELECT TO authenticated, anon USING (true);


--
-- Name: crop_data; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.crop_data ENABLE ROW LEVEL SECURITY;

--
-- PostgreSQL database dump complete
--


