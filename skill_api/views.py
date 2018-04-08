# Create your views here.
from django.shortcuts import render
from rest_framework import generics

from skill_api.models import SkillInfo
from skill_api.serializers import SkillInfoSerializer


class SkillCreateListView(generics.ListCreateAPIView):
    serializer_class = SkillInfoSerializer

    def get_queryset(self):
        query = self.request.GET.get('q')
        skills = SkillInfo.objects.all()
        if query:
            skills = skills.filter(name__icontains=query)
        return skills


class SkillRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = SkillInfoSerializer
    queryset = SkillInfo.objects.all()


def home(request):
    response = render(request, 'home.html', {})
    response['Cache-Control'] = 'no-cache, no-store'
    return response
