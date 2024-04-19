import { AuthProvider } from "@refinedev/core";

export const authProvider: AuthProvider = {
    check: async () => {
        const token = localStorage.getItem("my_access_token");

        return { authenticated: Boolean(token) };
    },
    getIdentity: async () => {
        try {
            const response = await fetch("http://localhost:8080/profile", {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("my_access_token"),
                    // Authorization:"Bearer " + "eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJyYWh1bGsuc29mdGRldiIsImlhdCI6MTcxMzQ0MDY0NywiZXhwIjoxNzEzNTI3MDQ3fQ.QTYHYZUoem76q6zFKGILJ33_yn1BbE72AzkuOl-sZpQzDR1VpYQpq5hTyOKmUKvC"
                },
            });
            if (response.status < 200 || response.status > 299) {
                throw new Error("Failed to fetch user profile: " + response.statusText);
            }

            const responseData = await response.text();

            if (!responseData) {
                throw new Error("Empty or incomplete response received");
            }
            const data = JSON.parse(responseData);

            return data;
        } catch (error) {
            if (error instanceof SyntaxError) {
                console.error("Error parsing JSON:", error);
            } else {
                console.error("Error fetching user profile:", error);
            }
            return null;
        }
    },

    register: async ({ firstName, lastName, username, email, password, role }) => {
        let data;
        try {
            const response = await fetch("http://localhost:8080/register", {
                method: "POST",
                body: JSON.stringify({ username, firstName, lastName, email, password, role }),
                headers: {
                    "Content-Type": "application/json",
                },
            });
            data = await response.json();
            if (data && data.token) {
                localStorage.setItem("my_access_token", data.token);
                return { success: true };
            }
            return { success: false };

        } catch (error) {
            console.error('Error occurred during fetch:', error);
            return { success: false, error: 'Failed to fetch or parse response' };
        }

    },
    login: async ({ username, password }) => {
        const response = await fetch(
            "http://localhost:8080/login",
            {
                method: "POST",
                body: JSON.stringify({ username, password }),
                headers: {
                    "Content-Type": "application/json",
                },
            },
        );

        const data = await response.json();

        if (data.token) {
            localStorage.setItem("my_access_token", data.token);
            return { success: true };
        }

        return { success: false };
    },
    logout: async () => {
        localStorage.removeItem("my_access_token");
        return { success: true };
    },
    onError: async (error) => {
        if (error?.status === 401) {
            return {
                logout: true,
                error: { message: "Unauthorized" },
            };
        }

        return {};
    },

};