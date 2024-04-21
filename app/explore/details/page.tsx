// app/explore/details/page.tsx
"use client";

import React, { useState } from 'react';
import CompanyComponent from '@/app/components/CompanyComponent'  // Adjust the import path as necessary
import { roboto } from '@/app/ui/fonts';

const Home = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [companies, setCompanies] = useState<(string | null)[]>([null, null]);

    const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault(); // Prevent the form from causing a page reload
        setCompanies(prev => {
            const updatedCompanies = [...prev];
            if (!updatedCompanies[0]) { // First slot is empty
                updatedCompanies[0] = searchTerm;
            } else if (!updatedCompanies[1]) { // Second slot is empty
                updatedCompanies[1] = searchTerm;
            } else { // Both slots are full, apply FIFO
                updatedCompanies.push(searchTerm);
                updatedCompanies.shift(); // Remove the first company
            }
            return updatedCompanies;
        });
        setSearchTerm(''); // Optionally clear the input after submission
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const discardCompany = (index: number) => {
        setCompanies(prev => {
            const updatedCompanies = [...prev];
            updatedCompanies[index] = null;
            return updatedCompanies;
        });
    };

    return (
      <div>
          <div>
              <h1 className={`${roboto.className} text-left text-xl md:text-3xl bg-gray-50 p-3`}>
                Search For Company Statistics
              </h1>
          </div>
            <form onSubmit={handleSearchSubmit} style={{ marginBottom: '20px' }}>
                <input
                    type="text"
                    placeholder="Search for a company"
                    value={searchTerm}
                    onChange={handleInputChange}
                    style={{ width: '100%', padding: '10px' }}
                />
                <button type="submit" style={{ display: 'none' }}>Search</button>
            </form>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                {companies.map((company, index) =>
                    company ? (
                        <div key={index} style={{ width: '48%' }}>
                            <CompanyComponent
                                companyName={company}
                                onDiscard={() => discardCompany(index)}
                            />
                        </div>
                    ) : null
                )}
            </div>
        </div>
    );
};

export default Home;
