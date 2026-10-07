<?php

namespace App\Support;

/**
 * Registry of page-builder block types.
 *
 * To add a new block: append an entry to all(). The admin page builder renders
 * forms from "fields" automatically and the public renderer maps "key" to a
 * React component. Repeaters use "item_fields".
 */
class BlockRegistry
{
    public static function all(): array
    {
        return [
            'hero' => [
                'label' => 'Hero',
                'icon' => 'layout-template',
                'fields' => [
                    ['name' => 'badge', 'label' => 'Badge', 'type' => 'text'],
                    ['name' => 'title', 'label' => 'Title', 'type' => 'text', 'required' => true],
                    ['name' => 'subtitle', 'label' => 'Subtitle', 'type' => 'textarea'],
                    ['name' => 'primary_label', 'label' => 'Primary Button Label', 'type' => 'text'],
                    ['name' => 'primary_url', 'label' => 'Primary Button URL', 'type' => 'url'],
                    ['name' => 'secondary_label', 'label' => 'Secondary Button Label', 'type' => 'text'],
                    ['name' => 'secondary_url', 'label' => 'Secondary Button URL', 'type' => 'url'],
                    ['name' => 'image', 'label' => 'Image', 'type' => 'image'],
                    ['name' => 'align', 'label' => 'Alignment', 'type' => 'select', 'default' => 'left', 'options' => ['left' => 'Left', 'center' => 'Center']],
                ],
            ],
            'text' => [
                'label' => 'Text',
                'icon' => 'type',
                'fields' => [
                    ['name' => 'title', 'label' => 'Title', 'type' => 'text'],
                    ['name' => 'content', 'label' => 'Content', 'type' => 'richtext'],
                    ['name' => 'align', 'label' => 'Alignment', 'type' => 'select', 'default' => 'left', 'options' => ['left' => 'Left', 'center' => 'Center']],
                ],
            ],
            'image' => [
                'label' => 'Image',
                'icon' => 'image',
                'fields' => [
                    ['name' => 'image', 'label' => 'Image', 'type' => 'image'],
                    ['name' => 'alt', 'label' => 'Alt Text', 'type' => 'text'],
                    ['name' => 'caption', 'label' => 'Caption', 'type' => 'text'],
                ],
            ],
            'image_text' => [
                'label' => 'Image + Text',
                'icon' => 'columns',
                'fields' => [
                    ['name' => 'title', 'label' => 'Title', 'type' => 'text'],
                    ['name' => 'content', 'label' => 'Content', 'type' => 'richtext'],
                    ['name' => 'image', 'label' => 'Image', 'type' => 'image'],
                    ['name' => 'image_position', 'label' => 'Image Position', 'type' => 'select', 'default' => 'left', 'options' => ['left' => 'Left', 'right' => 'Right']],
                    ['name' => 'cta_label', 'label' => 'Button Label', 'type' => 'text'],
                    ['name' => 'cta_url', 'label' => 'Button URL', 'type' => 'url'],
                ],
            ],
            'cards' => [
                'label' => 'Cards',
                'icon' => 'layout-grid',
                'fields' => [
                    ['name' => 'title', 'label' => 'Title', 'type' => 'text'],
                    ['name' => 'subtitle', 'label' => 'Subtitle', 'type' => 'textarea'],
                    ['name' => 'items', 'label' => 'Cards', 'type' => 'repeater', 'item_fields' => [
                        ['name' => 'icon', 'label' => 'Icon', 'type' => 'text'],
                        ['name' => 'title', 'label' => 'Title', 'type' => 'text'],
                        ['name' => 'description', 'label' => 'Description', 'type' => 'textarea'],
                        ['name' => 'image', 'label' => 'Image', 'type' => 'image'],
                    ]],
                ],
            ],
            'features' => [
                'label' => 'Features',
                'icon' => 'list-checks',
                'fields' => [
                    ['name' => 'title', 'label' => 'Title', 'type' => 'text'],
                    ['name' => 'items', 'label' => 'Features', 'type' => 'repeater', 'item_fields' => [
                        ['name' => 'icon', 'label' => 'Icon', 'type' => 'text'],
                        ['name' => 'title', 'label' => 'Title', 'type' => 'text'],
                        ['name' => 'description', 'label' => 'Description', 'type' => 'textarea'],
                    ]],
                ],
            ],
            'testimonials' => [
                'label' => 'Testimonials',
                'icon' => 'quote',
                'fields' => [
                    ['name' => 'title', 'label' => 'Title', 'type' => 'text'],
                    ['name' => 'items', 'label' => 'Testimonials', 'type' => 'repeater', 'item_fields' => [
                        ['name' => 'name', 'label' => 'Name', 'type' => 'text'],
                        ['name' => 'role', 'label' => 'Role', 'type' => 'text'],
                        ['name' => 'content', 'label' => 'Content', 'type' => 'textarea'],
                        ['name' => 'rating', 'label' => 'Rating', 'type' => 'number', 'default' => 5],
                        ['name' => 'avatar', 'label' => 'Avatar', 'type' => 'image'],
                    ]],
                ],
            ],
            'statistics' => [
                'label' => 'Statistics',
                'icon' => 'bar-chart-3',
                'fields' => [
                    ['name' => 'title', 'label' => 'Title', 'type' => 'text'],
                    ['name' => 'items', 'label' => 'Statistics', 'type' => 'repeater', 'item_fields' => [
                        ['name' => 'value', 'label' => 'Value', 'type' => 'text'],
                        ['name' => 'label', 'label' => 'Label', 'type' => 'text'],
                    ]],
                ],
            ],
            'faq' => [
                'label' => 'FAQ',
                'icon' => 'help-circle',
                'fields' => [
                    ['name' => 'title', 'label' => 'Title', 'type' => 'text'],
                    ['name' => 'items', 'label' => 'Questions', 'type' => 'repeater', 'item_fields' => [
                        ['name' => 'question', 'label' => 'Question', 'type' => 'text'],
                        ['name' => 'answer', 'label' => 'Answer', 'type' => 'textarea'],
                    ]],
                ],
            ],
            'cta' => [
                'label' => 'Call To Action',
                'icon' => 'megaphone',
                'fields' => [
                    ['name' => 'title', 'label' => 'Title', 'type' => 'text'],
                    ['name' => 'subtitle', 'label' => 'Subtitle', 'type' => 'textarea'],
                    ['name' => 'primary_label', 'label' => 'Primary Button Label', 'type' => 'text'],
                    ['name' => 'primary_url', 'label' => 'Primary Button URL', 'type' => 'url'],
                    ['name' => 'secondary_label', 'label' => 'Secondary Button Label', 'type' => 'text'],
                    ['name' => 'secondary_url', 'label' => 'Secondary Button URL', 'type' => 'url'],
                ],
            ],
            'gallery' => [
                'label' => 'Gallery',
                'icon' => 'images',
                'fields' => [
                    ['name' => 'title', 'label' => 'Title', 'type' => 'text'],
                    ['name' => 'columns', 'label' => 'Columns', 'type' => 'select', 'default' => '3', 'options' => ['2' => '2', '3' => '3', '4' => '4']],
                    ['name' => 'items', 'label' => 'Images', 'type' => 'repeater', 'item_fields' => [
                        ['name' => 'image', 'label' => 'Image', 'type' => 'image'],
                        ['name' => 'caption', 'label' => 'Caption', 'type' => 'text'],
                    ]],
                ],
            ],
            'video' => [
                'label' => 'Video',
                'icon' => 'video',
                'fields' => [
                    ['name' => 'title', 'label' => 'Title', 'type' => 'text'],
                    ['name' => 'url', 'label' => 'Video URL', 'type' => 'url'],
                    ['name' => 'poster', 'label' => 'Poster', 'type' => 'image'],
                ],
            ],
            'contact' => [
                'label' => 'Contact',
                'icon' => 'mail',
                'fields' => [
                    ['name' => 'title', 'label' => 'Title', 'type' => 'text'],
                    ['name' => 'subtitle', 'label' => 'Subtitle', 'type' => 'textarea'],
                    ['name' => 'show_form', 'label' => 'Show Form', 'type' => 'boolean', 'default' => true],
                ],
            ],
            'html' => [
                'label' => 'Custom HTML',
                'icon' => 'code',
                'fields' => [
                    ['name' => 'content', 'label' => 'HTML', 'type' => 'textarea'],
                ],
            ],
            'spacer' => [
                'label' => 'Spacer',
                'icon' => 'move-vertical',
                'fields' => [
                    ['name' => 'height', 'label' => 'Height (px)', 'type' => 'number', 'default' => 48],
                ],
            ],
            'divider' => [
                'label' => 'Divider',
                'icon' => 'minus',
                'fields' => [
                    ['name' => 'style', 'label' => 'Style', 'type' => 'select', 'default' => 'solid', 'options' => ['solid' => 'Solid', 'dashed' => 'Dashed', 'dotted' => 'Dotted']],
                ],
            ],
        ];
    }

    public static function keys(): array
    {
        return array_keys(static::all());
    }

    public static function exists(string $key): bool
    {
        return array_key_exists($key, static::all());
    }
}
