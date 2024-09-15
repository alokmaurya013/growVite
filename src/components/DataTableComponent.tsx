import React, { useState, useEffect, useRef } from 'react';
import { DataTable, DataTablePageEvent } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { fetchPaginatedData } from '../services/api';
import { OverlayPanel } from 'primereact/overlaypanel';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import '../styles/DataTableComponent.css'; // Custom CSS for responsive styling

interface RowData {
  id: number;
  title: string;
  place_of_origin: string;
  artist_display: string;
  inscriptions: string;
  date_start: number;
  date_end: number;
}

const DataTableComponent: React.FC = () => {
  const [data, setData] = useState<RowData[]>([]);
  const [selectedRows, setSelectedRows] = useState<RowData[]>([]);
  const [page, setPage] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const rowsPerPage = 12; // Define how many rows you want to display per page
  const [customRowNumber, setCustomRowNumber] = useState<number | null>(null);
  const overlayPanelRef = useRef<OverlayPanel>(null);

  // Fetch data from server
  const fetchData = async (pageNumber: number) => {
    const response = await fetchPaginatedData(pageNumber);
    return response;
  };

  useEffect(() => {
    const getData = async () => {
      const response = await fetchData(page + 1);
      setData(response.data);
      setTotalRecords(response.totalRecords);
    };
    getData();
  }, [page]);

  // Handle page change
  const onPageChange = (e:DataTablePageEvent) => {
    setPage(e.page??0);
  };

  // Handle row selection
  const onSelectionChange = (e: any) => {
    const updatedSelection = e.value as RowData[];
    setSelectedRows(updatedSelection);
  };

  // Handle custom row selection across pages
  const handleCustomRowSelection = async () => {
    if (!customRowNumber || customRowNumber <= 0) return;

    let rowsToSelect: RowData[] = [];
    let remainingRows = customRowNumber; // Remaining rows to select
    let currentPage = page + 1;

    while (remainingRows > 0) {
      const response = await fetchData(currentPage);

      if (response.data.length === 0) break; // No more data to fetch

      const rowsFromPage = response.data.slice(0, remainingRows); // Get the rows from current page
      rowsToSelect = [...rowsToSelect, ...rowsFromPage];

      remainingRows -= rowsFromPage.length; // Decrease remaining rows count
      currentPage++; // Move to next page
    }

    setSelectedRows(rowsToSelect); // Update selected rows with all the rows from all necessary pages
    overlayPanelRef.current?.hide(); // Hide overlay panel
  };

  return (
    <div className="datatable-container">
      <DataTable
        value={data}
        selection={selectedRows}
        onSelectionChange={onSelectionChange}
        paginator
        totalRecords={totalRecords}
        lazy
        rows={rowsPerPage}
        onPage={onPageChange}
        dataKey="id"
        selectionMode="checkbox"
        scrollable
        scrollHeight="400px" // Set maximum vertical scroll height
        style={{ minWidth: '600px' }} // Set minimum width for horizontal scrolling
      >
        <Column
          selectionMode="multiple"
          headerStyle={{ width: '3em', position: 'relative' }}
        ></Column>
        <Column
          header={() => (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {/* OverlayPanel trigger button */}
              <Button
                icon="pi pi-chevron-down" // dropdown icon for the overlay panel trigger
                className="p-button-text"
                onClick={(e) => overlayPanelRef.current?.toggle(e)}
                style={{
                  color: 'black',
                  backgroundColor: 'transparent',
                }}
              />

              {/* OverlayPanel for selecting custom rows */}
              <OverlayPanel ref={overlayPanelRef}>
                <div style={{ padding: '1em' }}>
                  <InputNumber
                    value={customRowNumber}
                    onValueChange={(e) => setCustomRowNumber(e.value!)}
                    placeholder="Select rows.."
                    min={1}
                    max={totalRecords}
                  />
                  <div className="p-mt-2">
                    <Button
                      label="Submit"
                      onClick={handleCustomRowSelection}
                      style={{
                        color: 'black',
                        borderColor: 'black',
                        borderWidth: '1px',
                        backgroundColor: 'transparent',
                      }}
                    />
                  </div>
                </div>
              </OverlayPanel>
            </div>
          )}
        ></Column>
        <Column field="title" header="Title" style={{ width: '250px' }}></Column>
        <Column field="place_of_origin" header="Place of Origin" style={{ width: '200px' }}></Column>
        <Column field="artist_display" header="Artist Display" style={{ width: '250px' }}></Column>
        <Column field="inscriptions" header="Inscriptions" style={{ width: '300px' }}></Column>
        <Column field="date_start" header="Date Start" style={{ width: '150px' }}></Column>
        <Column field="date_end" header="Date End" style={{ width: '150px' }}></Column>
      </DataTable>
    </div>
  );
};

export default DataTableComponent;
