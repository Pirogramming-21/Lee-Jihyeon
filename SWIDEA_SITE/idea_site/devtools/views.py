from django.views.generic import ListView
from django.views.generic.edit import CreateView
from django.views.generic import DetailView
from django.views.generic.edit import DeleteView
from django.views.generic.edit import UpdateView
from django.urls import reverse_lazy
from .models import DevTool

class DevToolListView(ListView):
    model = DevTool
    template_name = 'devtools/devtool_list.html'
    context_object_name = 'devtools'


class DevToolCreateView(CreateView):
    model = DevTool
    fields = ['name', 'kind', 'content']
    template_name = 'devtools/devtool_form.html'
    success_url = reverse_lazy('devtool_list')

class DevToolDetailView(DetailView):
    model = DevTool
    template_name = 'devtools/devtool_detail.html'


class DevToolDeleteView(DeleteView):
    model = DevTool
    success_url = reverse_lazy('devtool_list')
    template_name = 'devtools/devtool_confirm_delete.html'


class DevToolUpdateView(UpdateView):
    model = DevTool
    fields = ['name', 'kind', 'content']
    template_name = 'devtools/devtool_form.html'

    def get_success_url(self):
        return reverse_lazy('devtool_detail', kwargs={'pk': self.object.pk})