-- +goose Up
-- +goose StatementBegin
CREATE TABLE users (
  id Utf8 NOT NULL,
  full_name Utf8,
  email Utf8,
  avatar_url Utf8,
  created_at Timestamp,
  updated_at Timestamp,
  INDEX users_email_unique GLOBAL UNIQUE SYNC ON (email),
  PRIMARY KEY (id)
);
-- +goose StatementEnd

-- +goose StatementBegin
CREATE TABLE oauth_accounts (
  id Utf8 NOT NULL,
  provider Utf8,
  provider_account_id Utf8,
  user_id Utf8,
  email Utf8,
  created_at Timestamp,
  updated_at Timestamp,
  INDEX oauth_accounts_provider_account_unique GLOBAL UNIQUE SYNC ON (provider, provider_account_id),
  INDEX oauth_accounts_by_user GLOBAL ON (user_id),
  INDEX oauth_accounts_by_email GLOBAL ON (email),
  PRIMARY KEY (id)
);
-- +goose StatementEnd

-- +goose StatementBegin
CREATE TABLE guest_sessions (
  id Utf8 NOT NULL,
  created_at Timestamp,
  updated_at Timestamp,
  PRIMARY KEY (id)
);
-- +goose StatementEnd

-- +goose StatementBegin
CREATE TABLE challenge_snippets (
  id Utf8 NOT NULL,
  slug Utf8,
  topic_slug Utf8,
  title Utf8,
  language Utf8,
  code Utf8,
  created_at Timestamp,
  updated_at Timestamp,
  INDEX challenge_snippets_slug_unique GLOBAL UNIQUE SYNC ON (slug),
  INDEX challenge_snippets_by_topic GLOBAL ON (topic_slug, created_at, id),
  PRIMARY KEY (id)
);
-- +goose StatementEnd

-- +goose StatementBegin
CREATE TABLE challenges (
  id Utf8 NOT NULL,
  snippet_id Utf8,
  slug Utf8,
  topic_slug Utf8,
  title Utf8,
  prompt Utf8,
  code Utf8,
  challenge_order Int32,
  created_at Timestamp,
  updated_at Timestamp,
  INDEX challenges_slug_unique GLOBAL UNIQUE SYNC ON (slug),
  INDEX challenges_by_snippet GLOBAL ON (snippet_id, challenge_order, id),
  INDEX challenges_by_topic_order GLOBAL ON (topic_slug, challenge_order, created_at, id),
  PRIMARY KEY (id)
);
-- +goose StatementEnd

-- +goose StatementBegin
CREATE TABLE challenge_options (
  id Utf8 NOT NULL,
  challenge_id Utf8,
  option_order Int32,
  label Utf8,
  is_correct Bool,
  feedback Utf8,
  INDEX challenge_options_by_challenge GLOBAL ON (challenge_id, option_order, id),
  PRIMARY KEY (id)
);
-- +goose StatementEnd

-- +goose StatementBegin
CREATE TABLE user_challenge_progress (
  user_id Utf8 NOT NULL,
  challenge_id Utf8 NOT NULL,
  needs_review Bool,
  answered_count Int32,
  correct_count Int32,
  updated_at Timestamp,
  INDEX user_challenge_progress_by_review GLOBAL ON (user_id, needs_review, challenge_id),
  PRIMARY KEY (user_id, challenge_id)
);
-- +goose StatementEnd

-- +goose StatementBegin
CREATE TABLE guest_challenge_progress (
  guest_session_id Utf8 NOT NULL,
  challenge_id Utf8 NOT NULL,
  needs_review Bool,
  answered_count Int32,
  correct_count Int32,
  updated_at Timestamp,
  INDEX guest_challenge_progress_by_review GLOBAL ON (guest_session_id, needs_review, challenge_id),
  PRIMARY KEY (guest_session_id, challenge_id)
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE guest_challenge_progress;
-- +goose StatementEnd

-- +goose StatementBegin
DROP TABLE user_challenge_progress;
-- +goose StatementEnd

-- +goose StatementBegin
DROP TABLE challenge_options;
-- +goose StatementEnd

-- +goose StatementBegin
DROP TABLE challenges;
-- +goose StatementEnd

-- +goose StatementBegin
DROP TABLE challenge_snippets;
-- +goose StatementEnd

-- +goose StatementBegin
DROP TABLE guest_sessions;
-- +goose StatementEnd

-- +goose StatementBegin
DROP TABLE oauth_accounts;
-- +goose StatementEnd

-- +goose StatementBegin
DROP TABLE users;
-- +goose StatementEnd
