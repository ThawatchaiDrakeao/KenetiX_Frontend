import { createContext, useContext, useState } from 'react';

const KinetixContext = createContext();

export const KinetixProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [rentals, setRentals] = useState([]);

    const addRental = (item) => {
        setRentals(prev => [...prev, item]);
    };

    return (
        <KinetixContext.Provider value={{ user, setUser, addRental, rentals }}>
            {children}
        </KinetixContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useKinetix = () => useContext(KinetixContext);