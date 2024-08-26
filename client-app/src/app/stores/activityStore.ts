import { makeAutoObservable } from "mobx";
import { Activity } from "../models/activity";
import agent from "../api/agent";

export default class ActivityStore {
    activities: Activity[] = [];
    selectedActivity: Activity | null = null;
    editMode = false;
    loading = false;
    loadingInitial = false;

    constructor() {
        makeAutoObservable(this);
    }

    loadActivities = async () => {
        this.loadingInitial = true;

        try {
            const activities = await agent.Activities.list();
            activities.forEach(act => {
                act.date = act.date.split('T')[0];
                this.activities.push(act);
                this.loadingInitial = false;
            });
        } catch (error) {
            console.log(error);
            this.loadingInitial = false;
        }
    }
}
