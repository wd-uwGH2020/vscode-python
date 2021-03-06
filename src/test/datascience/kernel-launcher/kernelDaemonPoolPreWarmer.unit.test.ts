// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { anything, instance, mock, verify, when } from 'ts-mockito';
import { IExperimentsManager } from '../../../client/common/types';
import { KernelDaemonPool } from '../../../client/datascience/kernel-launcher/kernelDaemonPool';
import { KernelDaemonPreWarmer } from '../../../client/datascience/kernel-launcher/kernelDaemonPreWarmer';
import {
    IInteractiveWindowProvider,
    INotebookAndInteractiveWindowUsageTracker,
    INotebookEditorProvider
} from '../../../client/datascience/types';

// tslint:disable: max-func-body-length no-any
suite('Data Science - Kernel Daemon Pool PreWarmer', () => {
    let prewarmer: KernelDaemonPreWarmer;
    let notebookEditorProvider: INotebookEditorProvider;
    let interactiveProvider: IInteractiveWindowProvider;
    let usageTracker: INotebookAndInteractiveWindowUsageTracker;
    let daemonPool: KernelDaemonPool;
    setup(() => {
        notebookEditorProvider = mock<INotebookEditorProvider>();
        interactiveProvider = mock<IInteractiveWindowProvider>();
        usageTracker = mock<INotebookAndInteractiveWindowUsageTracker>();
        daemonPool = mock<KernelDaemonPool>();
        const experiment = mock<IExperimentsManager>();
        when(experiment.inExperiment(anything())).thenReturn(true);
        prewarmer = new KernelDaemonPreWarmer(
            instance(notebookEditorProvider),
            instance(interactiveProvider),
            [],
            instance(usageTracker),
            instance(daemonPool),
            instance(experiment)
        );
    });
    test('Should not pre-warm daemon pool if ds was never used', async () => {
        when(usageTracker.lastInteractiveWindowOpened).thenReturn(undefined);
        when(usageTracker.lastNotebookOpened).thenReturn(undefined);

        await prewarmer.activate(undefined);

        verify(daemonPool.preWarmKernelDaemons()).never();
    });
});
