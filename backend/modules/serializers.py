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

class GeminiExplanationRequestSerializer(serializers.Serializer):
    INTERACTION_TYPE_CHOICES = [
        ('explain_mistakes', 'Explain Mistakes'), # Existing
        ('discuss_open_ended', 'Discuss Open-ended'), # Existing
        ('explain_fact_opinion_choice', 'Explain Fact/Opinion Choice'), # New for Fact-Opinion
        ('feedback_on_rewrite', 'Feedback on Rewrite'),         # New for Fact-Opinion
        ('feedback_on_justification', 'Feedback on Justification'), # New for Fact-Opinion
        ('discuss_statement_nature', 'Discuss Statement Nature'), # New for Fact-Opinion
        ('assist_fact_check', 'Assist Fact Check'),             # New for Fact-Opinion
        ('general_query', 'General Query'),                      # New generic fallback
        ('discuss_game_find_bias', 'Discuss Find Bias Game'),
        ('discuss_game_fact_or_fake', 'Discuss Fact or Fake Game'),
        ('discuss_game_logical_fallacy', 'Discuss Logical Fallacy Game'),      # New
        ('discuss_game_propaganda_detector', 'Discuss Propaganda Detector Game') # New
    ]

    block_context = serializers.CharField(
        help_text="The context or questions from the learning block."
    )
    user_answers = serializers.ListField(
        child=serializers.CharField(allow_blank=True),
        allow_empty=True,
        help_text="User's answers to questions, or their written input for discussion tasks."
    )
    correct_answers = serializers.ListField(
        child=serializers.CharField(allow_blank=True),
        required=False, # Make optional
        allow_empty=True, # Already True, but good to be explicit
        help_text="Correct answers, if applicable (e.g., for mistake explanation)."
    )
    user_query = serializers.CharField(
        required=False,
        allow_blank=True,
        help_text="User's follow-up question to the AI."
    )
    interaction_type = serializers.ChoiceField(
        choices=INTERACTION_TYPE_CHOICES,
        default='explain_mistakes',
        help_text="The type of AI interaction requested."
    )

class GeminiExplanationResponseSerializer(serializers.Serializer):
    explanation = serializers.CharField()


from .models import UserTaskAnswer

class UserTaskAnswerSerializer(serializers.ModelSerializer):
    """
    Serializer for the UserTaskAnswer model.
    """
    class Meta:
        model = UserTaskAnswer
        fields = ['id', 'user', 'module_id', 'task_id', 'answers', 'last_updated']
        read_only_fields = ['user', 'last_updated']

    def create(self, validated_data):
        """
        Create or update a UserTaskAnswer instance.
        If an answer already exists for this user, module, and task, update it.
        Otherwise, create a new one.
        """
        user = self.context['request'].user
        module_id = validated_data.get('module_id')
        task_id = validated_data.get('task_id')
        answers = validated_data.get('answers')

        instance, created = UserTaskAnswer.objects.update_or_create(
            user=user,
            module_id=module_id,
            task_id=task_id,
            defaults={'answers': answers}
        )
        return instance

    def update(self, instance, validated_data):
        """
        Update an existing UserTaskAnswer instance.
        This is handled by update_or_create in the create method if we ensure
        that POST requests can also update. Alternatively, make create only create
        and update only update for stricter PUT semantics.
        For simplicity with typical frontend patterns (POST to save, which might be create or update),
        update_or_create in create is often sufficient.
        If PUT is used explicitly for updates, this method will be called.
        """
        instance.answers = validated_data.get('answers', instance.answers)
        instance.save()
        return instance
