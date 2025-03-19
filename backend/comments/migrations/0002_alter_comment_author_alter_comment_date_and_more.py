# Generated by Django 5.0.1 on 2025-03-19 00:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('comments', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='comment',
            name='author',
            field=models.CharField(max_length=200),
        ),
        migrations.AlterField(
            model_name='comment',
            name='date',
            field=models.DateTimeField(),
        ),
        migrations.AlterField(
            model_name='comment',
            name='image',
            field=models.URLField(blank=True, null=True),
        ),
    ]
