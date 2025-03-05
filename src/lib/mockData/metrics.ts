
import { MetricItem } from '../types';
import { 
  MessageSquare, 
  BarChart,
  Calendar,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

// Mock metrics
export const metrics: MetricItem[] = [
  {
    label: 'Total Conversations',
    value: 385,
    previousValue: 310,
    change: 24.19,
    changeType: 'increase',
    icon: MessageSquare
  },
  {
    label: 'Response Rate',
    value: '32%',
    previousValue: '28%',
    change: 14.29,
    changeType: 'increase',
    icon: BarChart
  },
  {
    label: 'Meetings Booked',
    value: 42,
    previousValue: 36,
    change: 16.67,
    changeType: 'increase',
    icon: Calendar
  },
  {
    label: 'Successful Deliveries',
    value: '98%',
    previousValue: '97%',
    change: 1.03,
    changeType: 'increase',
    icon: CheckCircle2
  },
  {
    label: 'Opt-Out Rate',
    value: '3.2%',
    previousValue: '3.5%',
    change: -8.57,
    changeType: 'decrease',
    icon: AlertTriangle
  }
];
