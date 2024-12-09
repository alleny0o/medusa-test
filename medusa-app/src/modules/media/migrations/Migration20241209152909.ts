import { Migration } from '@mikro-orm/migrations';

export class Migration20241209152909 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table if exists "media" add column if not exists "size" integer not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table if exists "media" drop column if exists "size";');
  }

}
