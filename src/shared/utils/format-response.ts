export function formatResponseKeys(data: any): any {
  if (Array.isArray(data)) {
    return data.map(item => formatResponseKeys(item));
  }

  if (typeof data === 'object' && data !== null) {
    const newObject: { [key: string]: any } = {};
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        newObject[`_${key}`] = formatResponseKeys(data[key]);
      }
    }
    return newObject;
  }

  return data;
}
