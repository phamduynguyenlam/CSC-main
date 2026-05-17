import { SidebarItem } from './types';
import { DashboardIcon, SummaryIcon, LiveAnalysisIcon, SocialIcon } from './components/icons/Icons';

export const SIDEBAR_ITEMS: SidebarItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: DashboardIcon },
    { id: 'liveAnalysis', label: 'Live Call Analysis', icon: LiveAnalysisIcon },
    { id: 'socialFeedback', label: 'Social Feedback', icon: SocialIcon },
    { id: 'productSummary', label: 'Product Summary', icon: SummaryIcon },
];