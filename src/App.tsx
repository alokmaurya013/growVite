import React from 'react';
import DataTable from './components/DataTableComponent';
import 'primereact/resources/themes/saga-blue/theme.css';  // Theme
import 'primereact/resources/primereact.min.css';           // Core CSS
import 'primeicons/primeicons.css';                         // Icons

const App: React.FC = () => {
  return (
    <div className="App">
      <DataTable/>
    </div>
  );
};

export default App;
