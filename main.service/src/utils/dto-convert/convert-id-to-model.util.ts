export function convertIdsToModels<T>(ids: number[], model: new () => T): T[] {
  const models = new Array<T>();

  for (const id of ids) {
    const item = new model();
    (item as any).id = id;
    models.push(item);
  }

  return models;
}
