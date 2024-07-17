from django.views.generic import ListView
from django.db.models import Count
from django.views.generic.edit import CreateView
from django.views.generic import DetailView
from django.views.generic.edit import DeleteView
from django.views.generic.edit import UpdateView
from django.urls import reverse_lazy
from .models import Idea

class IdeaListView(ListView):
    model = Idea
    template_name = 'ideas/idea_list.html'
    context_object_name = 'ideas'
    paginate_by = 4

    def get_queryset(self):
        queryset = super().get_queryset()
        sort = self.request.GET.get('sort', 'latest')
        
        if sort == 'stars':
            queryset = queryset.annotate(star_count=Count('ideastar')).order_by('-star_count', '-created_at')
        elif sort == 'name':
            queryset = queryset.order_by('title', '-created_at')
        elif sort == 'oldest':
            queryset = queryset.order_by('created_at')
        else:  # latest
            queryset = queryset.order_by('-created_at')
        
        return queryset

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['current_sort'] = self.request.GET.get('sort', 'latest')
        return context
        

class IdeaCreateView(CreateView):
    model = Idea
    fields = ['title', 'image', 'content', 'interest', 'devtools']
    template_name = 'ideas/idea_form.html'
    success_url = reverse_lazy('idea_list')


class IdeaDetailView(DetailView):
    model = Idea
    template_name = 'ideas/idea_detail.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        # 현재 아이디어가 찜한 목록에 있는지 확인
        starred_ideas = self.request.session.get('starred_ideas', [])
        context['is_starred'] = self.object.id in starred_ideas
        return context


class IdeaDeleteView(DeleteView):
    model = Idea
    success_url = reverse_lazy('idea_list')
    template_name = 'ideas/idea_confirm_delete.html'


class IdeaUpdateView(UpdateView):
    model = Idea
    fields = ['title', 'image', 'content', 'interest', 'devtools']
    template_name = 'ideas/idea_form.html'

    def get_success_url(self):
        return reverse_lazy('idea_detail', kwargs={'pk': self.object.pk})
    


from django.http import JsonResponse
from django.views.decorators.http import require_POST
from django.shortcuts import get_object_or_404
from .models import Idea, IdeaStar

@require_POST
def idea_star(request, pk):
    idea = get_object_or_404(Idea, pk=pk)
    
    starred_ideas = request.session.get('starred_ideas', [])
    
    if pk in starred_ideas:
        starred_ideas.remove(pk)
        starred = False
    else:
        starred_ideas.append(pk)
        starred = True
    
    request.session['starred_ideas'] = starred_ideas
    
    return JsonResponse({'starred': starred})

@require_POST
def idea_interest(request, pk, action):
    idea = get_object_or_404(Idea, pk=pk)
    
    if action == 'increase':
        idea.interest += 1
    elif action == 'decrease':
        idea.interest = max(0, idea.interest - 1)
    
    idea.save()
    
    return JsonResponse({'interest': idea.interest})