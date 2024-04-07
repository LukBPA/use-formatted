/*
	Potrebno je napraviti React hook za filtriranje, sortiranje i pretrazivanje podataka.
	Hook treba da prima array objekata odredjene strukture. U ovom slucaju koristimo array user-a iz users.json fajla.
	Hook treba da vraca formatirane podatke kao i funkcije za sortiranje, pretrazivanje i filtriranje.
  Omoguciti ulancano pozivanje implementiranih funkcija.
	
	Funkcija za pretrazivanje prima string i pretrazuje sve propertije na user objektu.
	Funkcija za filtriranje prima funkciju koju poziva za svaki entry u array-u.
	Funkcija za sortiranje moze da primi string (property name) po kojem treba da odradi standardni sort
	ili da primi funkciju za sortiranje (slicno kao i filter funkcija).

	Za zadatak kreirati poseban projekat gdje ce sadrzaj App.tsx fajla biti ovaj fajl.
	
	Koristiti React i TypeScript.

	Puno srece ;-)
*/

import { useEffect, useState } from "react";
import users from "./users.json";
import { Person } from "./models/Person";
import useFormattedData from "./hooks/useFormattedData";

const App = () => {
  const [data, setData] = useState<Person[]>(users as Person[]);
  const { formatted, sortBy, filter, search } = useFormattedData(
    data as Person[]
  );

  /**
   * Unutar ovog useEffect poziva bice proizvoljnim redom pozivane implementirane funkcije za
   * search, filter i sort da bi testirali tvoju implementaciju.
   */
  useEffect(() => {
    search("ard");
    sortBy("firstName");
    filter((person: Person) => person.id > 80);
  }, []);

  useEffect(() => {
    setData(formatted);
  }, [formatted])

  return (
    <div>
      {formatted.map(({ id, firstName, lastName, birthdate }) => (
        <div key={id}>
          <div>
            {id}. {firstName} {lastName} - {birthdate}
          </div>
        </div>
      ))}
    </div>
  );
};

export default App;
