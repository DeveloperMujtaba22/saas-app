'use client';

import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { formUrlQuery } from '@/lib/utils';
import { subjects } from '@/constants';

const SubjectFilter = () => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const subjectParam = searchParams.get('subject') || 'all';

  // ✅ Handle change directly - no useState needed
  const handleSubjectChange = (value: string) => {
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: 'subject',
      value: value === 'all' ? null : value,
    });

    router.push(`${pathname}${newUrl}`, { scroll: false });
  };

  return (
    <Select onValueChange={handleSubjectChange} value={subjectParam}>
      <SelectTrigger className="border border-black rounded-lg px-4 py-2 h-fit capitalize">
        <SelectValue placeholder="Subject" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all" className="capitalize">
          All subjects
        </SelectItem>
        {subjects.map((subj) => (
          <SelectItem key={subj} value={subj} className="capitalize">
            {subj}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default SubjectFilter;