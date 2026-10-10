<?php

namespace App\Support;

/**
 * Central registry of every configurable setting.
 *
 * To add a new setting: append an entry under the relevant group below.
 * The settings seeder and the admin settings UI both read from here, so a
 * single definition keeps storage, defaults and the form in sync.
 *
 * Definition keys:
 *   type      string|text|boolean|integer|float|color|select|media|password|email|url|json
 *   default   default value
 *   public    whether it is exposed (non-sensitive) on the public config API
 *   encrypted whether the stored value must be encrypted at rest
 *   label     human readable label used by the admin UI
 *   options   [value => label] for select inputs
 */
class SettingsRegistry
{
    public static function all(): array
    {
        return [
            'general' => [
                'site_name' => ['type' => 'string', 'default' => 'Sadat Upgrade', 'public' => true, 'label' => 'Site Name'],
                'site_description' => ['type' => 'text', 'default' => 'A digital innovation company delivering web development, mobile apps, UI/UX design and digital marketing.', 'public' => true, 'label' => 'Site Description'],
                'tagline' => ['type' => 'string', 'default' => 'Digital Solutions That Drive Results', 'public' => true, 'label' => 'Tagline'],
                'contact_email' => ['type' => 'email', 'default' => 'hello@sadatupgrade.com', 'public' => true, 'label' => 'Contact Email'],
                'contact_emails' => ['type' => 'json', 'default' => [], 'public' => true, 'label' => 'Additional Contact Emails', 'ui_type' => 'list'],
                'contact_phone' => ['type' => 'string', 'default' => '+1 (555) 123-4567', 'public' => true, 'label' => 'Contact Phone'],
                'contact_phones' => ['type' => 'json', 'default' => [], 'public' => true, 'label' => 'Additional Contact Phones', 'ui_type' => 'list'],
                'address' => ['type' => 'string', 'default' => 'New York, NY 10001, United States', 'public' => true, 'label' => 'Address'],
                'timezone' => ['type' => 'select', 'default' => 'UTC', 'public' => false, 'label' => 'Timezone', 'options' => self::timezones()],
                'default_language' => ['type' => 'string', 'default' => 'en', 'public' => true, 'label' => 'Default Language'],
                'date_format' => ['type' => 'string', 'default' => 'M d, Y', 'public' => true, 'label' => 'Date Format'],
                'time_format' => ['type' => 'string', 'default' => 'h:i A', 'public' => true, 'label' => 'Time Format'],
                'copyright_text' => ['type' => 'string', 'default' => 'All rights reserved.', 'public' => true, 'label' => 'Copyright Text'],
            ],
            'website' => [
                'maintenance_mode' => ['type' => 'boolean', 'default' => false, 'public' => true, 'label' => 'Maintenance Mode'],
                'maintenance_message' => ['type' => 'text', 'default' => 'We are performing scheduled maintenance. Please check back shortly.', 'public' => true, 'label' => 'Maintenance Message'],
                'registration_enabled' => ['type' => 'boolean', 'default' => true, 'public' => true, 'label' => 'Allow Registration'],
                'comments_enabled' => ['type' => 'boolean', 'default' => true, 'public' => false, 'label' => 'Enable Comments'],
                'default_pagination' => ['type' => 'integer', 'default' => 15, 'public' => false, 'label' => 'Default Pagination'],
                'posts_per_page' => ['type' => 'integer', 'default' => 9, 'public' => true, 'label' => 'Posts Per Page'],
                'newsletter_enabled' => ['type' => 'boolean', 'default' => true, 'public' => true, 'label' => 'Newsletter Popup Enabled'],
            ],
            'security' => [
                'session_lifetime' => ['type' => 'integer', 'default' => 120, 'public' => false, 'label' => 'Session Lifetime (minutes)'],
                'login_max_attempts' => ['type' => 'integer', 'default' => 5, 'public' => false, 'label' => 'Max Login Attempts'],
                'login_decay_minutes' => ['type' => 'integer', 'default' => 1, 'public' => false, 'label' => 'Login Lockout (minutes)'],
                'password_min_length' => ['type' => 'integer', 'default' => 8, 'public' => false, 'label' => 'Minimum Password Length'],
                'password_require_mixed_case' => ['type' => 'boolean', 'default' => true, 'public' => false, 'label' => 'Require Mixed Case'],
                'password_require_numbers' => ['type' => 'boolean', 'default' => true, 'public' => false, 'label' => 'Require Numbers'],
                'password_require_symbols' => ['type' => 'boolean', 'default' => false, 'public' => false, 'label' => 'Require Symbols'],
                'two_factor_enabled' => ['type' => 'boolean', 'default' => false, 'public' => false, 'label' => 'Two-Factor Authentication'],
                'force_https' => ['type' => 'boolean', 'default' => false, 'public' => false, 'label' => 'Force HTTPS'],
            ],
            'email' => [
                'mail_mailer' => ['type' => 'select', 'default' => 'log', 'public' => false, 'label' => 'Mailer', 'options' => ['log' => 'Log', 'smtp' => 'SMTP', 'sendmail' => 'Sendmail', 'ses' => 'Amazon SES', 'postmark' => 'Postmark']],
                'mail_host' => ['type' => 'string', 'default' => '127.0.0.1', 'public' => false, 'label' => 'SMTP Host'],
                'mail_port' => ['type' => 'integer', 'default' => 2525, 'public' => false, 'label' => 'SMTP Port'],
                'mail_username' => ['type' => 'string', 'default' => '', 'public' => false, 'label' => 'SMTP Username'],
                'mail_password' => ['type' => 'password', 'default' => '', 'public' => false, 'encrypted' => true, 'label' => 'SMTP Password'],
                'mail_encryption' => ['type' => 'select', 'default' => 'tls', 'public' => false, 'label' => 'Encryption', 'options' => ['tls' => 'TLS', 'ssl' => 'SSL', 'none' => 'None']],
                'mail_from_address' => ['type' => 'email', 'default' => 'hello@sadatupgrade.com', 'public' => false, 'label' => 'Sender Email'],
                'mail_from_name' => ['type' => 'string', 'default' => 'Sadat Upgrade', 'public' => false, 'label' => 'Sender Name'],
            ],
            'storage' => [
                'storage_disk' => ['type' => 'select', 'default' => 'public', 'public' => false, 'label' => 'Storage Disk', 'options' => ['public' => 'Local (public)', 's3' => 'Amazon S3']],
                'max_upload_size_kb' => ['type' => 'integer', 'default' => 5120, 'public' => false, 'label' => 'Max Upload Size (KB)'],
                'allowed_image_types' => ['type' => 'string', 'default' => 'jpg,jpeg,png,webp,gif,svg', 'public' => false, 'label' => 'Allowed Image Types'],
                'allowed_document_types' => ['type' => 'string', 'default' => 'pdf,doc,docx,xls,xlsx,ppt,pptx,txt,csv,zip', 'public' => false, 'label' => 'Allowed Document Types'],
                'image_quality' => ['type' => 'integer', 'default' => 85, 'public' => false, 'label' => 'Image Quality'],
                'generate_thumbnails' => ['type' => 'boolean', 'default' => true, 'public' => false, 'label' => 'Generate Thumbnails'],
                'thumbnail_width' => ['type' => 'integer', 'default' => 400, 'public' => false, 'label' => 'Thumbnail Width (px)'],
            ],
            'social' => [
                'social_facebook' => ['type' => 'url', 'default' => 'https://facebook.com', 'public' => true, 'label' => 'Facebook'],
                'social_instagram' => ['type' => 'url', 'default' => 'https://instagram.com', 'public' => true, 'label' => 'Instagram'],
                'social_linkedin' => ['type' => 'url', 'default' => 'https://linkedin.com', 'public' => true, 'label' => 'LinkedIn'],
                'social_x' => ['type' => 'url', 'default' => 'https://x.com', 'public' => true, 'label' => 'X (Twitter)'],
                'social_youtube' => ['type' => 'url', 'default' => 'https://youtube.com', 'public' => true, 'label' => 'YouTube'],
                'social_github' => ['type' => 'url', 'default' => '', 'public' => true, 'label' => 'GitHub'],
                'social_links' => [
                    'type' => 'json',
                    'default' => [],
                    'public' => true,
                    'label' => 'Social Media Links',
                    'ui_type' => 'repeater',
                    'item_fields' => [
                        ['key' => 'platform', 'label' => 'Platform', 'type' => 'select', 'options' => ['facebook' => 'Facebook', 'instagram' => 'Instagram', 'linkedin' => 'LinkedIn', 'x' => 'X (Twitter)', 'youtube' => 'YouTube', 'github' => 'GitHub'], 'required' => true],
                        ['key' => 'url', 'label' => 'Profile URL', 'type' => 'url', 'required' => true],
                        ['key' => 'is_active', 'label' => 'Show on website', 'type' => 'boolean'],
                    ],
                ],
            ],
            'seo' => [
                'seo_title' => ['type' => 'string', 'default' => 'Sadat Upgrade - Transform Your Business with Digital Solutions', 'public' => true, 'label' => 'Default SEO Title'],
                'seo_description' => ['type' => 'text', 'default' => 'Sadat Upgrade is a digital innovation company delivering web development, mobile apps, UI/UX design and digital marketing.', 'public' => true, 'label' => 'Default Meta Description'],
                'seo_keywords' => ['type' => 'string', 'default' => 'digital agency, web development, mobile apps, ui ux, digital marketing', 'public' => true, 'label' => 'Meta Keywords'],
                'og_title' => ['type' => 'string', 'default' => 'Sadat Upgrade', 'public' => true, 'label' => 'Open Graph Title'],
                'og_description' => ['type' => 'text', 'default' => 'Transform your business with cutting edge digital solutions.', 'public' => true, 'label' => 'Open Graph Description'],
                'og_image' => ['type' => 'media', 'default' => null, 'public' => true, 'label' => 'Open Graph Image'],
                'twitter_card' => ['type' => 'select', 'default' => 'summary_large_image', 'public' => true, 'label' => 'Twitter Card Type', 'options' => ['summary' => 'Summary', 'summary_large_image' => 'Summary Large Image']],
                'twitter_site' => ['type' => 'string', 'default' => '', 'public' => true, 'label' => 'Twitter Site Handle'],
                'robots_index' => ['type' => 'boolean', 'default' => true, 'public' => true, 'label' => 'Allow Indexing'],
                'robots_follow' => ['type' => 'boolean', 'default' => true, 'public' => true, 'label' => 'Allow Following'],
                'canonical_url' => ['type' => 'url', 'default' => '', 'public' => true, 'label' => 'Canonical URL'],
                'google_analytics_id' => ['type' => 'string', 'default' => '', 'public' => true, 'label' => 'Google Analytics ID'],
                'sitemap_enabled' => ['type' => 'boolean', 'default' => true, 'public' => true, 'label' => 'Sitemap Enabled'],
            ],
            'branding' => [
                'brand_name' => ['type' => 'string', 'default' => 'Sadat Upgrade', 'public' => true, 'label' => 'Brand Name'],
                'brand_tagline' => ['type' => 'string', 'default' => 'Digital Innovation Agency', 'public' => true, 'label' => 'Brand Tagline'],
                'logo_light' => ['type' => 'media', 'default' => null, 'public' => true, 'label' => 'Light Logo'],
                'logo_dark' => ['type' => 'media', 'default' => null, 'public' => true, 'label' => 'Dark Logo'],
                'logo_icon' => ['type' => 'media', 'default' => null, 'public' => true, 'label' => 'Icon / Mark'],
                'favicon' => ['type' => 'media', 'default' => null, 'public' => true, 'label' => 'Favicon'],
            ],
            'api' => [
                'api_enabled' => ['type' => 'boolean', 'default' => true, 'public' => false, 'label' => 'API Enabled'],
                'api_rate_limit' => ['type' => 'integer', 'default' => 60, 'public' => false, 'label' => 'API Rate Limit (per minute)'],
                'api_public_enabled' => ['type' => 'boolean', 'default' => true, 'public' => false, 'label' => 'Public API Enabled'],
            ],
            'localization' => [
                'localization_enabled' => ['type' => 'boolean', 'default' => false, 'public' => true, 'label' => 'Localization Enabled'],
                'rtl_support' => ['type' => 'boolean', 'default' => true, 'public' => true, 'label' => 'RTL Support'],
                'detect_browser_locale' => ['type' => 'boolean', 'default' => false, 'public' => true, 'label' => 'Detect Browser Locale'],
            ],
            'backup' => [
                'backup_enabled' => ['type' => 'boolean', 'default' => false, 'public' => false, 'label' => 'Enable Scheduled Backups'],
                'backup_schedule' => ['type' => 'select', 'default' => 'daily', 'public' => false, 'label' => 'Backup Schedule', 'options' => ['hourly' => 'Hourly', 'daily' => 'Daily', 'weekly' => 'Weekly', 'monthly' => 'Monthly']],
                'backup_retention_days' => ['type' => 'integer', 'default' => 30, 'public' => false, 'label' => 'Retention (days)'],
                'backup_disk' => ['type' => 'select', 'default' => 'local', 'public' => false, 'label' => 'Backup Disk', 'options' => ['local' => 'Local', 's3' => 'Amazon S3']],
            ],
        ];
    }

    /**
     * Flattened map of "group.key" => definition.
     */
    public static function definitions(): array
    {
        $flat = [];

        foreach (static::all() as $group => $keys) {
            foreach ($keys as $key => $definition) {
                $flat["{$group}.{$key}"] = $definition + [
                    'group' => $group,
                    'key' => $key,
                    'public' => false,
                    'encrypted' => false,
                ];
            }
        }

        return $flat;
    }

    public static function groups(): array
    {
        return array_keys(static::all());
    }

    protected static function timezones(): array
    {
        $zones = ['UTC', 'Africa/Cairo', 'Asia/Kabul', 'Asia/Karachi', 'Asia/Dubai', 'Asia/Riyadh', 'Europe/London', 'Europe/Berlin', 'Europe/Paris', 'America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles', 'Australia/Sydney'];

        return array_combine($zones, $zones);
    }
}
