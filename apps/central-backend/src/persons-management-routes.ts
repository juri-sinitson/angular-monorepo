import express from 'express';

// TODO: adjust project tags and as the case may be
// rearrange the libs.
// eslint-disable-next-line @nx/enforce-module-boundaries
import { PersonInterface as EntityInterface } from '@angular-monorepo/persons-management/domain';
import { nextId } from './lib';

const router = express.Router();

const startingId = 1000;

const entitiesListBackup: Readonly<EntityInterface[]> = Object.freeze([
  {
    id: `${startingId}`,
    name: 'John',
    surname: 'Doe',
    birthDay: 3,
    birthMonth: 2,
    birthYear: 1990,
  },
  {
    id: '1001',
    name: 'Jane',
    surname: 'Smith',
    birthDay: 5,
    birthMonth: 1,    
  },
  {
    id: '1002',
    name: 'Michael',
    surname: 'Johnson',
    birthDay: 28,
    birthMonth: 6,
    birthYear: 1985,
  },
  {
    id: '1003',
    name: 'Emily',
    surname: 'Brown',
    birthDay: 11,
    birthMonth: 12,    
  },
  {
    id: '1004',
    name: 'David',
    surname: 'Wilson',
    birthDay: 15,
    birthMonth: 8,
    birthYear: 1988,
  },
  {
    id: '1005',
    name: 'Olivia',
    surname: 'Taylor',
    birthDay: 29,
    birthMonth: 2,    
  },
]);

const entitiesList: EntityInterface[] = [...entitiesListBackup];

function restoreData() {
  // Restore the entities list to the backup
  entitiesList.splice(0, entitiesList.length, ...entitiesListBackup);
}

function generateNextId(): string {
  return nextId(startingId, entitiesList);  
}

router.post('/api/persons-management/seed', (req, res) => {
  restoreData();
  res.send({ message: 'Data restored successfully' });
});

router.get('/api/persons-management/persons', (req, res) => {
  res.send(entitiesList);
});

router.post('/api/persons-management/persons', (req, res) => {
  // For debugging purposes
  /*res.sendStatus(404);
  return;*/

  const newEntity: EntityInterface = req.body;
  // Generate the next id and random code for the new entity
  const nextId = generateNextId();
  newEntity.id = nextId;

  setTimeout(() => {
    // Add the new entity to the entities list
    entitiesList.push(newEntity);
    console.log('New entity:', newEntity);
    res.send(newEntity);
  }, 0);
});

router.put('/api/persons-management/persons/:id', (req, res) => {
  // For debugging purposes
  /*res.sendStatus(404);
  return;*/

  const id = req.params.id;
  const updatedEntity: EntityInterface = req.body;

  // Find the entity and update it
  const entityIndex = entitiesList.findIndex((entity) => entity.id === id);
  if (entityIndex !== -1) {
    // Add a delay of 1 second before updating the entity
    setTimeout(() => {
      entitiesList[entityIndex] = updatedEntity;
      res.send(updatedEntity);
    }, 0);
  } else {
    res.sendStatus(404);
  }
});

// handle delete request
router.delete('/api/persons-management/persons/:id', (req, res) => {
  // For debugging purposes
  /*res.sendStatus(404);
  return;*/

  const id = req.params.id;

  setTimeout(() => {
    // Find the entity and delete it
    const entityIndex = entitiesList.findIndex((entity) => entity.id === id);
    if (entityIndex !== -1) {
      entitiesList.splice(entityIndex, 1);
      res.send({ message: 'Deleted successfully' });
    }
  }, 0);
});

export default router;
