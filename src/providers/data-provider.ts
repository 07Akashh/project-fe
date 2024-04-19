import type { DataProvider } from "@refinedev/core";

const API_URL = "http://localhost:8080/admin";
const fetcher = async (url: string, options?: RequestInit) => {
    return fetch(url, {
        ...options,
        headers: {
            ...options?.headers,
            Authorization: "eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJyYWh1bGsuc29mdGRldiIsImlhdCI6MTcxMzQ0MDY0NywiZXhwIjoxNzEzNTI3MDQ3fQ.QTYHYZUoem76q6zFKGILJ33_yn1BbE72AzkuOl-sZpQzDR1VpYQpq5hTyOKmUKvC"
        },
    });
};


export const dataProvider: DataProvider = {
    getOne: async () => {
        try {
            const response = await fetcher(`${API_URL}/users?page=0&limit=1`);
            if (response.status < 200 || response.status > 299) {
                throw new Error("Failed to fetch user profile: " + response.statusText);
            }

            const responseData = await response.text();

            if (!responseData) {
                throw new Error("Empty or incomplete response received");
            }

            const data = JSON.parse(responseData);
            console.log(data);

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
    getList: async ({ resource, pagination, filters, sorters, meta }) => {
        const params = new URLSearchParams();

        if (pagination) {
            const { page, limit } = pagination;
            if (page) params.append('page', page);
            if (limit) params.append('limit', limit);
        }
        const response = await fetch(
            `${API_URL}/${resource}?${params.toString()}`, {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("my_access_token"),
                // Authorization:"Bearer " + "eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJyYWh1bGsuc29mdGRldiIsImlhdCI6MTcxMzQ0MDY0NywiZXhwIjoxNzEzNTI3MDQ3fQ.QTYHYZUoem76q6zFKGILJ33_yn1BbE72AzkuOl-sZpQzDR1VpYQpq5hTyOKmUKvC"
            },
        }
        );

        if (response.status < 200 || response.status > 299) throw response;

        const data = await response.json();

        const total = Number(response.headers.get("x-total-count"));

        return {
            data,
            total,
        };
    },
    create: async ({ resource, variables }) => {
        console.log(variables)
        const response = await fetcher(`${API_URL}/admin/${resource}`, {
            method: "POST",
            body: JSON.stringify(variables),
            headers: {
                // Authorization: "Bearer " + localStorage.getItem("my_access_token"),
                Authorization: "Bearer " + "eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJyYWh1bGsuc29mdGRldiIsImlhdCI6MTcxMzQ0MDY0NywiZXhwIjoxNzEzNTI3MDQ3fQ.QTYHYZUoem76q6zFKGILJ33_yn1BbE72AzkuOl-sZpQzDR1VpYQpq5hTyOKmUKvC",
                "Content-Type": "application/json",
            },
        });

        if (response.status < 200 || response.status > 299) throw response;

        const data = await response.json();

        return { data };
    },

    update: async ({ resource, id, variables }) => {
        const response = await fetcher(`${API_URL}/${resource}`, {
            method: "PATCH",
            body: JSON.stringify(variables),
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (response.status < 200 || response.status > 299) throw response;

        const data = await response.json();

        return { data };
    },

}

