import { FC } from "react"; 
import { useEffect, useState } from "react";
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Button } from "primereact/button";
        
import "./table.css";

interface Artworks {
    title: string;
    place_of_origin: string;
    artist_display: string;
    inscriptions: string;
    date_start: Date;
    date_end: Date;
}

const Table: FC = () => {

    const [page, setPage] = useState<number>(1);
    const [artworks, setArtworks] = useState<Array<Artworks>>([]);
    const [disableButton, setDisableButton] = useState<boolean>(false);

    async function fetchArtworks() {
        try {
            const response = await fetch(`https://api.artic.edu/api/v1/artworks?page=${page}`);
            const data = (await response.json()).data;

            setArtworks(data);
        } catch(error) {
            console.error("Error while fetching artworks:", error);
        }
    }

    useEffect(() => {
        fetchArtworks();
    }, []);

    const nextPage = () => {
        setDisableButton(true);

        setPage(page+1);

        fetchArtworks()
        .then(() => {
            setDisableButton(false);
            console.log("Successfully fetched page: " + page);
        })
    }

    const prevPage = () => {
        if(page > 0) {
            setDisableButton(true);

            setPage(page-1);

            fetchArtworks()
            .then(() => {
                setDisableButton(false);
                console.log("Successfully fetched page: " + page);
            })
        }
    }

    return (
        <div className="wrapper">
            <div className="table-wrapper">
                <h2 className="table-name"> Artworks </h2>

                <DataTable value={artworks}
                    rows={12}
                    dataKey="id"
                    >

                    <Column field="title" header="Title" style={{padding: '10px'}}></Column>
                    <Column field="place_of_origin" header="Origin" style={{padding: '10px'}}></Column>
                    <Column field="artist_display" header="Display" style={{padding: '10px'}}></Column>
                    <Column field="inscriptions" header="Inscriptions" style={{padding: '10px'}}></Column>
                    <Column field="date_start" header="Start" style={{padding: '10px'}}></Column>
                    <Column field="date_end" header="End" style={{padding: '10px'}}></Column>
                </DataTable>

                <div className="pagination">
                    <Button onClick={prevPage} disabled={disableButton}> Prev </Button>
                    <Button> {page} </Button>
                    <Button onClick={nextPage} disabled={disableButton}> Next </Button>
                </div>
            </div>
        </div>
    )
}

export default Table;