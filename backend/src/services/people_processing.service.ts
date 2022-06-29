import people_data from '../data/people_data.json';

export class PeopleProcessing {
    getById(id: number) {
        return people_data.find((p) => p.id === id);
    }

    getAll(start?: number) {
      const data = people_data;
      if (!start) {
        return data;
      }

      return people_data.slice((start - 1) * 10, start * 10);
    }
}
