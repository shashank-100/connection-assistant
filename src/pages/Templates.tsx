import { AppNavigation } from '@/components/AppNavigation';
import { TemplateEditor } from '@/components/templates/TemplateEditor';

const Templates = () => {
  return (
    <div className="min-h-screen bg-background">
      <AppNavigation />
      <div className="h-[calc(100vh-48px)]">
        <TemplateEditor />
      </div>
    </div>
  );
};

export default Templates;
