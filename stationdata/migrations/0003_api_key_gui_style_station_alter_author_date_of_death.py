# Generated by Django 4.0.3 on 2022-07-01 08:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('stationdata', '0002_remove_book_language'),
    ]

    operations = [
        migrations.CreateModel(
            name='API_Key',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('ISS_API_KEY', models.CharField(max_length=100)),
                ('SAT_API_KEY', models.CharField(max_length=100)),
            ],
            options={
                'ordering': ['ISS_API_KEY'],
            },
        ),
        migrations.CreateModel(
            name='GUI_Style',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('selectedstyle', models.CharField(blank=True, choices=[('d', 'Standard'), ('s', 'Second Style'), ('t', 'Third Style'), ('f', 'Fourth Style')], default='d', help_text='Gui Style', max_length=1)),
            ],
        ),
        migrations.CreateModel(
            name='Station',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('station_id', models.CharField(max_length=100)),
                ('mac_id', models.CharField(max_length=12)),
                ('email', models.CharField(max_length=100)),
                ('latitude', models.CharField(max_length=10)),
                ('longitude', models.CharField(max_length=10)),
            ],
            options={
                'ordering': ['station_id'],
            },
        ),
        migrations.AlterField(
            model_name='author',
            name='date_of_death',
            field=models.DateField(blank=True, null=True),
        ),
    ]
