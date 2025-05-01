const fs = require('fs');
const path = require('path');

// Function to read a JSON file
function readJsonFile(filePath) {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    return null;
  }
}

// Function to merge collections
function mergeCollections() {
  const serverDir = path.join(__dirname, '../server');
  const postmanServerDir = path.join(serverDir, 'postman');
  const postmanRootDir = path.join(__dirname, '../postman');
  const outputFile = path.join(postmanRootDir, 'Movie_Booking_Complete_API_Collection.json');
  
  // Create postman directory in root if it doesn't exist
  if (!fs.existsSync(postmanRootDir)) {
    fs.mkdirSync(postmanRootDir, { recursive: true });
    console.log(`Created directory: ${postmanRootDir}`);
  }
  
  // Create a base collection structure
  const mergedCollection = {
    info: {
      name: "Movie Booking Complete API Collection",
      description: "A comprehensive collection of all API endpoints for the Movie Booking System",
      schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
    },
    item: []
  };
  
  // Get all directories in the server's postman folder
  const directories = fs.readdirSync(postmanServerDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);
  
  console.log(`Found ${directories.length} collection directories`);
  
  // Process each directory
  directories.forEach(dir => {
    const dirPath = path.join(postmanServerDir, dir);
    
    // Get all JSON files in the directory
    const files = fs.readdirSync(dirPath)
      .filter(file => file.endsWith('.json'));
    
    if (files.length === 0) {
      console.log(`No JSON files found in ${dir}`);
      return;
    }
    
    // Process each JSON file
    files.forEach(file => {
      const filePath = path.join(dirPath, file);
      const collection = readJsonFile(filePath);
      
      if (!collection) {
        return;
      }
      
      console.log(`Processing ${dir}/${file}`);
      
      // Create a folder for this collection
      const folderItem = {
        name: dir.charAt(0).toUpperCase() + dir.slice(1),
        description: `API endpoints for ${dir}`,
        item: []
      };
      
      // Add all items from the collection to the folder
      if (collection.item && Array.isArray(collection.item)) {
        folderItem.item = collection.item;
      }
      
      // Add the folder to the merged collection
      mergedCollection.item.push(folderItem);
    });
  });
  
  // Write the merged collection to a file
  fs.writeFileSync(outputFile, JSON.stringify(mergedCollection, null, 2), 'utf8');
  console.log(`Merged collection saved to ${outputFile}`);
  
  // Also copy the environment file if it exists
  const envFile = path.join(postmanServerDir, 'Movie_Booking_API_Environment.json');
  if (fs.existsSync(envFile)) {
    const destEnvFile = path.join(postmanRootDir, 'Movie_Booking_API_Environment.json');
    fs.copyFileSync(envFile, destEnvFile);
    console.log(`Environment file copied to ${destEnvFile}`);
  }
}

// Run the merge function
mergeCollections();
