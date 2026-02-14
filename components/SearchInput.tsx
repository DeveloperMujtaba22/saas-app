'use client';

import Image from 'next/image';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Input } from './ui/input';
import { formUrlQuery } from '@/lib/utils';

const SearchInput = () => {
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();
    const query = searchParams.get('topic') || '';
    
    const [searchQuery, setSearchQuery] = useState(query);

    // Sync with URL on mount
    useEffect(() => {
        setSearchQuery(query);
    }, [query]);

    // Debounced search
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            const newUrl = formUrlQuery({
                params: searchParams.toString(),
                key: 'topic',
                value: searchQuery || null, // Empty search clears param
            });
            
            router.push(`${pathname}${newUrl}`, { scroll: false });
        }, 500);

        // Cleanup
        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery, router, searchParams, pathname]);

    return (
        <div className='relative border border-black rounded-lg items-center flex px-2 py-1 h-fit gap-2'>
            <Image src='/icons/search.svg' alt='search' width={15} height={15} />
            <Input 
                placeholder='Search companions...' 
                className='outline-none border-none focus-visible:ring-0 focus-visible:ring-offset-0' 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)}
            />
        </div>
    );
};

export default SearchInput;