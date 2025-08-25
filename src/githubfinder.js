// const { timeStamp } = require('console');
// const https = require('https');
// const { cachedDataVersionTag } = require('v8');

// // GitHub Finder logic
// class fetchGitHubUser {
//     constructor(options = {}){
//         this.config ={
//             baseUrl: 'api.github.com',
//             userAgent: options.userAgent || 'Electron Github Finder',
//             timeout: options.timeout || 10000,
//             ...options
//         };
//         this.cache = new Map();
//         this.cacheTimeout = options.cacheTimeout || 300000;
//     }
//     /**
//      * Fetches a GitHub user's data
//      * @param {string} username - Github username to fetch 
//      * @returns {Promise<Object>} User data from the API
//      */
//     async fetchUser(username) {
//         this._validateUsername(username);
//         const cleanUsername = username.trim().toLowerCase();
//         if(this._isCacheValid(cleanUsername)){
//             console.log(`Cache hit for user: ${cleanUsername}`);
//             return this.cache.get(cleanUsername);
//         }
//         console.log(`Fetching Github user: ${cleanUsername}`);
//         try {
//             const userData = await this._makeRequest(`/users/${encodeURIComponent(cleanUsername)}`);
//             this._cacheResult(cleanUsername,userData);
//             console.log(`Successfully fetched data for${cleanUsername}`);
//             return userData;
//         } catch (error) {
//             console.error(`Error fetching ${cleanUsername}: `,error.message);
//             throw error;
            
//         }
//     }
//     /**
//      * Fetches github user's repositories
//      * @param {string} username - Github Username
//      * @param {Object} options -Query options(per_page,sort)
//      * @returns {Promise<Array>} Array of repos
//      */
//     async fetchUserRepos(username,options={}) {
//         this._validateUsername(username);
//         const cleanUsername = username.trim();
//         const queryParams = new URLSearchParams({
//             per_page: options.perPage || 30,
//             sort: options.sort || 'updated',
//             direction: options.direction || 'desc',
//             ...options
//         });
//         const path = `/users/${encodeURIComponent(cleanUsername)}/repos?${queryParams}`;
//         return await this._makeRequest(path);
//     }

//     /**
//      * Clears the internal cache - useful for manual refresh
//      */
//     clearCache(){
//         this.cache.clear();
//         console.log("Cleared Cache!");
//     }

//     /**
//      * Gets cache stats
//      * @returns {Object} - Cache stats
//      */
//     getCacheStats(){
//         return {
//             size: this.cache.size,
//             entries: Array.from(this.cache.keys()),
//             maxAge: this.cacheTimeout
//         };
//     }

//     /**  Validates username input
//    * @private
//    * @param {string} username - Username to validate
//    * @throws {Error} If username is invalid
//    */
//     _validateUsername(username){
//         if (!username|| typeof (username) !== 'string' || username.trim() === '') {
//             throw new Error('Username is required and should not be empty');
//         }
//         if (username.trim().length > 39) {
//             throw new Error('Usernames cannot be longer than 39 characters');
//         }
//         const validUsernamePattern = /^[a-zA-Z0-9]([a-zA-Z0-9]*[a-zA-Z0-9])?$/;
//         if (!validUsernamePattern.test(username.trim())){
//             throw new Error('Invalid GitHub Username format');
            
//         }
//     }

//     /**
//      * Makes the actual http request
//      * @private
//      * @param {string} path  API path
//      * @returns {Promise<Object>} API data
//      */
//     _makeRequest(path){
//         return new Promise((resolve,reject) =>{
//             const options = {
//                 hostname: this.config.baseUrl,
//                 path: path,
//                 method: 'GET',
//                 headers: {
//                     'User-Agent': this.config.userAgent,
//                     'Accept': `application/vnd.github.${this.config.apiVersion}+json`,
//                     'X-GitHub-Api-Version': '2022-11-28' // Latest stable API version
//                 }
//             };
//             const req = https.request(options,(res) =>{
//                 let data = '';
//                 res.on('data',(chunk)=>{
//                     data += chunk;
//                 });
//                 res.on('end',() =>{
//                     try {
//                         const jsonData = JSON.parse(data);
//                         if(res.statusCode === 200){
//                             resolve(jsonData);
//                         }else if (res.statusCode === 404) {
//                             reject(new Error(`User not found! :(`));
//                         } else if (res.statusCode === 403) {
//                             reject(new Error(`API rate limit exceeded. GitHub is giving us the silent treatment! `));
//                         } else{
//                             reject(new Error(`GitHub API error: ${res.statusCode} - ${jsonData.message || 'Unknown error try again'}`));
//                         }
//                     } catch (parseError) {
//                         reject(new Error(`Failed to parse GitHub API response: ${parseError.message}`));
//                     }
//                 });
//             });
//             req.on('error',(error) => {
//                 reject(new Error(`Network error: ${error.message}`));
//             });
//             req.setTimeout(this.config.timeout, () => {
//                 req.destroy();
//                 reject(new Error(`Request timeout after ${this.config.timeout}ms -  GitHub might be having a coffee break `))
//             });
//             req.end();
//         });
//     }


//     /**
//      * Checks if cached data is valid
//      * @private
//      * @param {string} key cache key
//      * @returns {boolean} True if cache is valid
//      */
//     _isCacheValid(key){
//         const cached = this.cache.get(key);
//         if(!cached) return false;
//         const now = Date.now();
//         return (now-cached.timestamp) < this.cacheTimeout;
//     }

//     /**
//      * Caches API result and hold 100 records and starts cleaning up from the oldest to prevent memory leaks
//      * @private
//      * @param {string} key 
//      * @param {Object} data 
//      */
//     _cacheResult(key,data){
//         this.cache.set(key,{
//             data,
//             timestamp: Date.now()
//         });
//         if(this.cache.size > 100){
//             const oldestKey = this.cache.keys().next().value;
//             this.cache.delete(oldestKey);
//         }
//     }

// }
// module.exports = { 
//     GitHubFinder,
//     // Convenience function that creates an instance and calls fetchUser
//     fetchGitHubUser: async (username) => {
//         const finder = new GitHubFinder();
//         return await finder.fetchUser(username);
//     }
// };
// This module handles all the GitHub API logic
// It's like having a dedicated GitHub whisperer, but now with proper organization!

// This module handles all the GitHub API logic
// It's like having a dedicated GitHub whisperer, but now with proper organization!

const https = require('https');

/**
 * A class to handle all GitHub API interactions
 * Because classes make everything more organized! 🏗️
 */
class GitHubFinder {
  constructor(options = {}) {
    // Set up default configuration - you can customize these!
    this.config = {
      baseUrl: 'api.github.com',
      userAgent: options.userAgent || 'Electron GitHub Finder',
      timeout: options.timeout || 10000, // 10 seconds
      apiVersion: options.apiVersion || 'v3',
      ...options
    };
    
    // Cache for storing recent requests (optional optimization)
    this.cache = new Map();
    this.cacheTimeout = options.cacheTimeout || 300000; // 5 minutes
  }

  /**
   * Fetches a GitHub user's data
   * @param {string} username - The GitHub username to fetch
   * @returns {Promise<Object>} User data from GitHub API
   */
  async fetchUser(username) {
    // Input validation - because garbage in, garbage out!
    this._validateUsername(username);
    
    const cleanUsername = username.trim().toLowerCase();
    
    // Check cache first - why make unnecessary requests?
    if (this._isCacheValid(cleanUsername)) {
      console.log(`Cache hit for user: ${cleanUsername} 🎯`);
      return this.cache.get(cleanUsername).data;
    }
    
    console.log(`Fetching GitHub user: ${cleanUsername}`);
    
    try {
      const userData = await this._makeRequest(`/users/${encodeURIComponent(cleanUsername)}`);
      
      // Cache the successful result
      this._cacheResult(cleanUsername, userData);
      console.log(`Successfully fetched data for ${cleanUsername} ✅`);
      return userData;
      
    } catch (error) {
      console.error(`Error fetching user ${cleanUsername}:`, error.message);
      throw error;
    }
  }

  /**
   * Fetches a user's repositories (bonus method for future use!)
   * @param {string} username - The GitHub username
   * @param {Object} options - Query options (per_page, sort, etc.)
   * @returns {Promise<Array>} Array of repositories
   */
  async fetchUserRepos(username, options = {}) {
    this._validateUsername(username);
    
    const cleanUsername = username.trim();
    const queryParams = new URLSearchParams({
      per_page: options.perPage || 30,
      sort: options.sort || 'updated',
      direction: options.direction || 'desc',
      ...options
    });
    
    const path = `/users/${encodeURIComponent(cleanUsername)}/repos?${queryParams}`;
    return await this._makeRequest(path);
  }

  /**
   * Clears the internal cache - useful for testing or manual refresh
   */
  clearCache() {
    this.cache.clear();
    console.log('Cache cleared! 🗑️');
  }

  /**
   * Gets cache statistics - because everyone loves stats!
   * @returns {Object} Cache stats
   */
  getCacheStats() {
    return {
      size: this.cache.size,
      entries: Array.from(this.cache.keys()),
      maxAge: this.cacheTimeout
    };
  }

  // Private methods - the behind-the-scenes magic ✨

  /**
   * Validates username input
   * @private
   * @param {string} username - Username to validate
   * @throws {Error} If username is invalid
   */
  _validateUsername(username) {
    if (!username || typeof username !== 'string' || username.trim() === '') {
      throw new Error('Username is required and must be a non-empty string');
    }
    
    if (username.trim().length > 39) {
      throw new Error('GitHub usernames cannot be longer than 39 characters');
    }
    
    // GitHub username validation (simplified)
    const validUsernamePattern = /^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?$/;
    if (!validUsernamePattern.test(username.trim())) {
      throw new Error('Invalid GitHub username format');
    }
  }

  /**
   * Makes the actual HTTP request to GitHub API
   * @private
   * @param {string} path - API path
   * @returns {Promise<Object>} API response data
   */
  _makeRequest(path) {
    return new Promise((resolve, reject) => {
      const options = {
        hostname: this.config.baseUrl,
        path: path,
        method: 'GET',
        headers: {
          'User-Agent': this.config.userAgent,
          'Accept': `application/vnd.github.${this.config.apiVersion}+json`,
          'X-GitHub-Api-Version': '2022-11-28' // Latest stable API version
        }
      };

      const req = https.request(options, (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          try {
            const jsonData = JSON.parse(data);
            
            if (res.statusCode === 200) {
              resolve(jsonData);
            } else if (res.statusCode === 404) {
              reject(new Error(`User not found. Did they escape to GitLab? 🤔`));
            } else if (res.statusCode === 403) {
              reject(new Error(`API rate limit exceeded. GitHub is giving us the silent treatment! 🤐`));
            } else {
              reject(new Error(`GitHub API error: ${res.statusCode} - ${jsonData.message || 'Unknown error'}`));
            }
          } catch (parseError) {
            reject(new Error(`Failed to parse GitHub API response: ${parseError.message}`));
          }
        });
      });

      req.on('error', (error) => {
        reject(new Error(`Network error: ${error.message}`));
      });

      // Set timeout - because nobody likes hanging requests
      req.setTimeout(this.config.timeout, () => {
        req.destroy();
        reject(new Error(`Request timeout after ${this.config.timeout}ms - GitHub might be having a coffee break ☕`));
      });

      req.end();
    });
  }

  /**
   * Checks if cached data is still valid
   * @private
   * @param {string} key - Cache key
   * @returns {boolean} True if cache is valid
   */
  _isCacheValid(key) {
    const cached = this.cache.get(key);
    if (!cached) return false;
    
    const now = Date.now();
    return (now - cached.timestamp) < this.cacheTimeout;
  }

  /**
   * Caches the API result
   * @private
   * @param {string} key - Cache key
   * @param {Object} data - Data to cache
   */
  _cacheResult(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
    
    // Clean up old cache entries to prevent memory leaks
    if (this.cache.size > 100) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }
  }
}

// Export both the class and a convenience function for backwards compatibility
module.exports = { 
  GitHubFinder,
  // Convenience function that creates an instance and calls fetchUser
  fetchGitHubUser: async (username) => {
    const finder = new GitHubFinder();
    return await finder.fetchUser(username);
  }
};