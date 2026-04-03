import { useParams } from 'react-router-dom';
import '../styles/PeoplePage.scss';
import { Person } from '../types';
import { Loader } from './Loader';
import PersonLink from './PersonLink';
import { useEffect, useState } from 'react';
import { getPeople } from '../api';

export default function PeoplePage() {
  const { slug } = useParams();

  const [people, setPeople] = useState<Person[]>([]);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    getPeople()
      .then(data => {
        setPeople(data);
      })
      .catch(() => {
        setErrorMsg('There are no people on the server');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <Loader />;
  }

  if (errorMsg) {
    return (
      <div className="people-page">
        <h1 className="title">People Page</h1>
        <div className="box table-container">
          <p data-cy="peopleLoadingError" className="has-text-danger">
            {errorMsg}
          </p>
        </div>
      </div>
    );
  }

  if (people.length === 0) {
    return (
      <div className="people-page">
        <h1 className="title">People Page</h1>
        <div className="box table-container">
          <p data-cy="noPeopleMessage">There are no people on the server</p>
        </div>
      </div>
    );
  } else {
    return (
      <div className="people-page">
        <h1 className="title">People Page</h1>
        <div className="box table-container">
          <table
            data-cy="peopleTable"
            className="table is-striped is-hoverable is-fullwidth"
          >
            <thead>
              <tr>
                <th>Name</th>
                <th>Sex</th>
                <th>Born</th>
                <th>Died</th>
                <th>Mother</th>
                <th>Father</th>
              </tr>
            </thead>
            <tbody>
              {people.map(person => {
                const mother = people.find(p => p.name === person.motherName);
                const father = people.find(p => p.name === person.fatherName);

                return (
                  <tr
                    data-cy="person"
                    key={person.slug}
                    className={
                      slug === person.slug ? 'has-background-warning' : ''
                    }
                  >
                    <td>
                      <PersonLink person={person} name={person.name} />
                    </td>
                    <td>{person.sex}</td>
                    <td>{person.born}</td>
                    <td>{person.died}</td>
                    <td>
                      <PersonLink person={mother} name={person.motherName} />
                    </td>
                    <td>
                      <PersonLink person={father} name={person.fatherName} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}
