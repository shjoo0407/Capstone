from django.db import migrations, models

class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0004_blacklistedtoken'),  # accounts 앱의 이전 마이그레이션 파일
    ]

    operations = [
        #migrations.RunSQL('ALTER TABLE django_admin_log MODIFY user_id bigint;'),
        #migrations.RunSQL('ALTER TABLE django_admin_log DROP FOREIGN KEY django_admin_log_user_id_c564eba6_fk_auth_user_id;'),
        migrations.RunSQL('ALTER TABLE django_admin_log ADD CONSTRAINT fk_django_admin_log_user_id FOREIGN KEY (user_id) REFERENCES account(id) ON DELETE RESTRICT ON UPDATE RESTRICT;'),
    ]