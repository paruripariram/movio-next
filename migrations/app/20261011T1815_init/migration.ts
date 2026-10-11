#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/d10b4ef5586cbb73255a3f627e97e64bd349edd54cf889bc6273a1f40eb84d86/contract';
import endContract from '../../snapshots/d10b4ef5586cbb73255a3f627e97e64bd349edd54cf889bc6273a1f40eb84d86/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, fn, primaryKey } from '@prisma/orm-postgres/migration';

export default class M extends Migration<never, End> {
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createSchema({ schema: 'public' }),
      this.createTable({
        schema: 'public',
        table: 'collection',
        columns: [
          col('added_at', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('movie_id', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('platform', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('status', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('user_id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('wayched_at', 'timestamptz', { codecRef: { codecId: 'pg/timestamptz-temporal@1' } }),
        ],
        constraints: [primaryKey(['user_id', 'movie_id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'friendships',
        columns: [
          col('friend_id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('status', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('user_id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['user_id', 'friend_id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'genres',
        columns: [
          col('id', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('name', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'movie_genre',
        columns: [
          col('genre_id', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('movie_id', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
        ],
        constraints: [primaryKey(['movie_id', 'genre_id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'movies',
        columns: [
          col('poster_path', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('release_date', 'timestamptz', {
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('title', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('tmdb_id', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('type', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['tmdb_id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'users',
        columns: [
          col('creates_at', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('email', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('username', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.addUnique({
        schema: 'public',
        table: 'genres',
        constraint: 'genres_name_key',
        columns: ['name'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'users',
        constraint: 'users_email_key',
        columns: ['email'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'users',
        constraint: 'users_username_key',
        columns: ['username'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'collection',
        index: 'collection_movie_id_idx_b2c3efa2',
        columns: ['movie_id'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'collection',
        index: 'collection_user_id_idx_6c952402',
        columns: ['user_id'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'friendships',
        index: 'friendships_friend_id_idx_c4c059a1',
        columns: ['friend_id'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'friendships',
        index: 'friendships_user_id_idx_6c952402',
        columns: ['user_id'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'movie_genre',
        index: 'movie_genre_genre_id_idx_44287509',
        columns: ['genre_id'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'movie_genre',
        index: 'movie_genre_movie_id_idx_b2c3efa2',
        columns: ['movie_id'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'collection',
        foreignKey: {
          name: 'collection_user_id_fkey',
          columns: ['user_id'],
          references: { schema: 'public', table: 'users', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'collection',
        foreignKey: {
          name: 'collection_movie_id_fkey',
          columns: ['movie_id'],
          references: { schema: 'public', table: 'movies', columns: ['tmdb_id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'friendships',
        foreignKey: {
          name: 'friendships_user_id_fkey',
          columns: ['user_id'],
          references: { schema: 'public', table: 'users', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'friendships',
        foreignKey: {
          name: 'friendships_friend_id_fkey',
          columns: ['friend_id'],
          references: { schema: 'public', table: 'users', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'movie_genre',
        foreignKey: {
          name: 'movie_genre_movie_id_fkey',
          columns: ['movie_id'],
          references: { schema: 'public', table: 'movies', columns: ['tmdb_id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'movie_genre',
        foreignKey: {
          name: 'movie_genre_genre_id_fkey',
          columns: ['genre_id'],
          references: { schema: 'public', table: 'genres', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
