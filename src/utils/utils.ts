export function validateImageFormat(value: string){
    const values = value.split('.');
    const format = values[values.length -1];
    return format.match(/(jpeg|webp|gif|png|tiff)$/);
}