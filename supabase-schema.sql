-- Supabase schema for TaskFlow
-- Run this in Supabase SQL editor to create the database tables.

create type role as enum ('OWNER', 'ADMIN', 'MEMBER', 'VIEWER');

create table users (
  id text primary key,
  email text not null unique,
  password_hash text not null,
  name text not null,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table workspaces (
  id text primary key,
  name text not null,
  slug text not null unique,
  created_at timestamptz not null default now()
);

create table workspace_members (
  id text primary key,
  role role not null default 'MEMBER',
  user_id text not null,
  workspace_id text not null,
  constraint workspace_members_unique unique (user_id, workspace_id),
  constraint workspace_members_user_fk foreign key (user_id) references users(id) on delete cascade,
  constraint workspace_members_workspace_fk foreign key (workspace_id) references workspaces(id) on delete cascade
);

create table boards (
  id text primary key,
  title text not null,
  workspace_id text not null,
  created_at timestamptz not null default now(),
  constraint boards_workspace_fk foreign key (workspace_id) references workspaces(id) on delete cascade
);

create table lists (
  id text primary key,
  title text not null,
  position double precision not null,
  board_id text not null,
  constraint lists_board_fk foreign key (board_id) references boards(id) on delete cascade
);

create table cards (
  id text primary key,
  title text not null,
  description text,
  position double precision not null,
  due_date timestamptz,
  list_id text not null,
  created_at timestamptz not null default now(),
  constraint cards_list_fk foreign key (list_id) references lists(id) on delete cascade
);

create table card_assignees (
  id text primary key,
  card_id text not null,
  user_id text not null,
  constraint card_assignees_unique unique (card_id, user_id),
  constraint card_assignees_card_fk foreign key (card_id) references cards(id) on delete cascade,
  constraint card_assignees_user_fk foreign key (user_id) references users(id) on delete cascade
);

create table comments (
  id text primary key,
  content text not null,
  card_id text not null,
  user_id text not null,
  created_at timestamptz not null default now(),
  constraint comments_card_fk foreign key (card_id) references cards(id) on delete cascade,
  constraint comments_user_fk foreign key (user_id) references users(id) on delete cascade
);

create table attachments (
  id text primary key,
  file_name text not null,
  file_url text not null,
  file_type text not null,
  file_size integer not null,
  card_id text not null,
  created_at timestamptz not null default now(),
  constraint attachments_card_fk foreign key (card_id) references cards(id) on delete cascade
);

create table checklist_items (
  id text primary key,
  text text not null,
  is_done boolean not null default false,
  card_id text not null,
  constraint checklist_items_card_fk foreign key (card_id) references cards(id) on delete cascade
);

create table labels (
  id text primary key,
  name text not null,
  color text not null,
  board_id text not null,
  constraint labels_board_fk foreign key (board_id) references boards(id) on delete cascade
);

create table card_labels (
  card_id text not null,
  label_id text not null,
  constraint card_labels_pk primary key (card_id, label_id),
  constraint card_labels_card_fk foreign key (card_id) references cards(id) on delete cascade,
  constraint card_labels_label_fk foreign key (label_id) references labels(id) on delete cascade
);

create table notifications (
  id text primary key,
  user_id text not null,
  type text not null,
  message text not null,
  is_read boolean not null default false,
  created_at timestamptz not null default now(),
  constraint notifications_user_fk foreign key (user_id) references users(id) on delete cascade
);

-- Ensure Supabase Auth inserts can create rows in `public.users` via trigger.
-- Make `password_hash` nullable so the trigger can insert auth-only accounts.
alter table public.users alter column password_hash drop not null;

-- Optional debug table to capture trigger errors
create table if not exists public.auth_trigger_errors (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  err text,
  payload jsonb
);

-- Drop any old trigger/function and create a robust one that uses the correct
-- auth meta column (`raw_user_meta_data`) and runs as SECURITY DEFINER.
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.create_profile_from_auth();

create or replace function public.create_profile_from_auth()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into public.users (id, email, name, password_hash, created_at)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.email),
    null,
    now()
  )
  on conflict (id) do nothing;
  return new;
exception when others then
  insert into public.auth_trigger_errors (err, payload) values (sqlerrm, row_to_json(new));
  return new;
end;
$$;

-- Ensure the function runs with sufficient privileges (owner must exist in your DB)
alter function public.create_profile_from_auth() owner to postgres;

create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.create_profile_from_auth();

