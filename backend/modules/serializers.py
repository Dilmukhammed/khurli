from rest_framework import serializers
from .models import UserModuleProgress # Assumes models.py exists from previous step

class UserModuleProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserModuleProgress
        fields = ['id', 'user', 'module_id', 'task_id', 'status', 'completed_at', 'last_updated_at']
        read_only_fields = ['user', 'completed_at', 'last_updated_at']

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        progress, created = UserModuleProgress.objects.update_or_create(
            user=validated_data['user'],
            module_id=validated_data['module_id'],
            task_id=validated_data['task_id'],
            defaults={'status': validated_data.get('status', UserModuleProgress.ProgressStatus.COMPLETED)}
        )
        return progress
