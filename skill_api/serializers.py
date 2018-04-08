from rest_framework import serializers

from skill_api.models import SkillInfo


class SkillInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = SkillInfo
        fields = '__all__'
