package org.operaton.bpm.extension.robot;

import java.util.ArrayList;
import java.util.List;
import org.operaton.bpm.engine.impl.cfg.AbstractProcessEnginePlugin;
import org.operaton.bpm.engine.impl.cfg.ProcessEngineConfigurationImpl;
import org.operaton.bpm.engine.impl.scripting.env.ScriptEnvResolver;

/** Enables Camunda compatibility script shims for JavaScript by default. */
public class CamundaCompatScriptPlugin extends AbstractProcessEnginePlugin {

  @Override
  public void preInit(ProcessEngineConfigurationImpl configuration) {
    List<ScriptEnvResolver> resolvers = configuration.getEnvScriptResolvers();
    if (resolvers == null) {
      resolvers = new ArrayList<>();
      configuration.setEnvScriptResolvers(resolvers);
    }

    boolean alreadyRegistered =
        resolvers.stream()
            .anyMatch(
                resolver ->
                    resolver
                        .getClass()
                        .getName()
                        .equals(CamundaCompatScriptEnvResolver.class.getName()));
    if (!alreadyRegistered) {
      resolvers.add(new CamundaCompatScriptEnvResolver());
    }
  }
}
