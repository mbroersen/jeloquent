export default function (name: string): string {
    return `${name[0].toLowerCase()}${name.slice(1).replace(/([A-Z])/g, '-$1').toLowerCase()}`;
}