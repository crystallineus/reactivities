import { makeAutoObservable } from "mobx";
import { Activity } from "../models/activity";
import agent from "../api/agent";

export default class ActivityStore {
    activities: Activity[] = [];
    selectedActivity: Activity | undefined = undefined;
    editMode = false;
    loading = false;
    loadingInitial = false;

    constructor() {
        makeAutoObservable(this);
    }

    loadActivities = async () => {
        this.setLoadinInitial(true);

        try {
            const activities = await agent.Activities.list();
            activities.forEach(act => {
                act.date = act.date.split('T')[0];
                this.activities.push(act);
            });
            this.setLoadinInitial(false);
        } catch (error) {
            console.log(error);
            this.setLoadinInitial(false);
        }
    }

    setLoadinInitial = (state: boolean) => {
        this.loadingInitial = state;
    }

    selectActivity = (id: string) => {
        this.selectedActivity = this.activities.find(x => x.id === id);
    }

    cancelSelectedActivity = () => {
        this.selectedActivity = undefined;
    }

    openForm = (id?: string) => {
        id ? this.selectActivity(id) : this.cancelSelectedActivity();
        this.editMode = true;
    }

    closeForm = () => {
        this.editMode = false;
    }
}
