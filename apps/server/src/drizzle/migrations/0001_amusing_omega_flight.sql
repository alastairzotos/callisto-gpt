CREATE TABLE IF NOT EXISTS "plugin_configs" (
	"plugin_id" uuid NOT NULL,
	"key" varchar(255),
	"value" varchar(255)
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "plugin_configs" ADD CONSTRAINT "plugin_configs_plugin_id_plugins_id_fk" FOREIGN KEY ("plugin_id") REFERENCES "public"."plugins"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
