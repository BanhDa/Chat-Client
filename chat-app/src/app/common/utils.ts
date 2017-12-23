export class Utils {
    
    public static validString(input: string): boolean {
        return input !== undefined && (input.trim() !== '');
    }
}